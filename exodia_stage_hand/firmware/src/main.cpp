#include <Arduino.h>
#include <NimBLEDevice.h>

// ═══════════════════════════════════════════════════════════════
// PIN CONFIGURATION (ESP32-S3)
// ═══════════════════════════════════════════════════════════════
#define PIN_HEATER      4   // PWM to IRLZ44N
#define PIN_THERMISTOR  5   // ADC from 10K NTC
#define PIN_MOTOR_IDX   6   // PWM
#define PIN_MOTOR_MID   7   // PWM
#define PIN_MOTOR_RNG   15  // PWM
#define PIN_MOTOR_PNK   16  // PWM
#define PIN_EMG_FLEXOR  17  // ADC from MyoWare

// ═══════════════════════════════════════════════════════════════
// BLE UUIDS
// ═══════════════════════════════════════════════════════════════
#define THERMAL_SERVICE   "0000aaaa-0000-1000-8000-00805f9b34fb"
#define THERMAL_MODE      "0000aaa2-0000-1000-8000-00805f9b34fb"
#define THERMAL_STATE     "0000aaa3-0000-1000-8000-00805f9b34fb"
#define THERMAL_REACTION  "0000aaa5-0000-1000-8000-00805f9b34fb"

#define HAND_SERVICE      "0000bbbb-0000-1000-8000-00805f9b34fb"
#define HAND_CONFIG       "0000bbb0-0000-1000-8000-00805f9b34fb"
#define CHORD_TARGET      "0000bbb1-0000-1000-8000-00805f9b34fb"
#define ASSIST_LEVEL      "0000bbb2-0000-1000-8000-00805f9b34fb"
#define EMG_STATE         "0000bbb3-0000-1000-8000-00805f9b34fb"
#define HAPTIC_EVENT      "0000bbb5-0000-1000-8000-00805f9b34fb"

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════
NimBLEServer* pServer = nullptr;
NimBLECharacteristic* pChrThermState = nullptr;
NimBLECharacteristic* pChrEmgState = nullptr;

bool deviceConnected = false;
float currentTempC = 25.0f;
uint8_t thermalStatus = 0; // 0=Idle, 1=Warming, 2=Safety
uint8_t faultCode = 0;     // 0=None, 1=Sensor, 2=Overtemp
float targetTemp = 0;
unsigned long rxEndTime = 0;

float emgBaseline = 0;
bool emgCalibrated = false;

// ═══════════════════════════════════════════════════════════════
// THERMAL LOGIC
// ═══════════════════════════════════════════════════════════════
float readTempC() {
  int raw = analogRead(PIN_THERMISTOR);
  if (raw < 10 || raw > 4080) return -1; // Fault
  float r = 10000.0f * (4095.0f / (float)raw - 1.0f);
  float t = 1.0f / (log(r / 10000.0f) / 3950.0f + 1.0f / 298.15f) - 273.15f;
  return t;
}

void processThermal() {
  currentTempC = readTempC();
  
  // Safety cutoff
  if (currentTempC < 0 || currentTempC >= 40.0f || !deviceConnected) {
    analogWrite(PIN_HEATER, 0);
    thermalStatus = 2; // Safety
    faultCode = (currentTempC < 0) ? 1 : 2;
    targetTemp = 0;
    return;
  }

  // Active Reaction timeout
  if (millis() > rxEndTime && targetTemp > 0) {
    targetTemp = 0;
    thermalStatus = 0;
  }

  // Simple bang-bang control for MVP
  if (targetTemp > 0 && currentTempC < targetTemp) {
    analogWrite(PIN_HEATER, 180); // 70% power
    thermalStatus = 1;
  } else {
    analogWrite(PIN_HEATER, 0);
    if (targetTemp > 0) thermalStatus = 1; // Maintaining
    else thermalStatus = 0;
  }
}

// ═══════════════════════════════════════════════════════════════
// HAPTIC LOGIC
// ═══════════════════════════════════════════════════════════════
void setMotors(uint8_t i, uint8_t m, uint8_t r, uint8_t p) {
  analogWrite(PIN_MOTOR_IDX, i);
  analogWrite(PIN_MOTOR_MID, m);
  analogWrite(PIN_MOTOR_RNG, r);
  analogWrite(PIN_MOTOR_PNK, p);
}

class HandCallbacks : public NimBLECharacteristicCallbacks {
  void onWrite(NimBLECharacteristic* pChar) {
    std::string v = pChar->getValue();
    if (v.length() == 0) return;
    
    std::string uuid = pChar->getUUID().toString();
    
    if (uuid == CHORD_TARGET && v.length() >= 2) {
      uint8_t id = v[1];
      // Basic mappings (intensity 0-255)
      // G: mid+rng+pnk, C: idx+mid+rng, D: idx+mid+rng, Em: mid+rng, Am: idx+mid+rng
      uint8_t pwr = 150;
      if (id == 0) setMotors(0, pwr, pwr, pwr);      // G
      else if (id == 1) setMotors(pwr, pwr, pwr, 0); // C
      else if (id == 2) setMotors(pwr, pwr, pwr, 0); // D
      else if (id == 3) setMotors(0, pwr, pwr, 0);   // Em
      else if (id == 4) setMotors(pwr, pwr, pwr, 0); // Am
      else setMotors(0,0,0,0);
    }
    else if (uuid == HAPTIC_EVENT) {
      // Pulse all briefly
      setMotors(200,200,200,200);
      delay(200);
      setMotors(0,0,0,0);
    }
    else if (uuid == HAND_CONFIG) {
       // Off signal check
       if (v.length() >= 2 && v[1] == 1) setMotors(0,0,0,0); 
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// THERMAL CALLBACKS
// ═══════════════════════════════════════════════════════════════
class ThermalCallbacks : public NimBLECharacteristicCallbacks {
  void onWrite(NimBLECharacteristic* pChar) {
    std::string v = pChar->getValue();
    if (v.length() == 0) return;
    std::string uuid = pChar->getUUID().toString();
    
    if (uuid == THERMAL_MODE && v.length() >= 3) {
      if (v[1] == 0) targetTemp = 0; // Off
      else targetTemp = v[2]; // Target C
    }
    else if (uuid == THERMAL_REACTION && v.length() >= 4) {
      // RX payload: [version, id, intensity_pct, duration_sec]
      uint8_t rxId = v[1];
      uint8_t rxDur = v[3];
      targetTemp = 36.0f; // Safe warm bump
      rxEndTime = millis() + (rxDur * 1000);
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// EMG LOGIC
// ═══════════════════════════════════════════════════════════════
void processEMG() {
  if (!deviceConnected) return;

  float raw = analogRead(PIN_EMG_FLEXOR);
  float rms = raw; // MyoWare provides rectified integrated signal, read direct

  if (!emgCalibrated && millis() > 2000) {
    emgBaseline = rms;
    emgCalibrated = true;
  }

  float effort = 0;
  if (emgCalibrated) {
    effort = map(rms, emgBaseline, 3000, 0, 100);
    if (effort < 0) effort = 0;
    if (effort > 100) effort = 100;
  }

  // Notify [v, length, qual, eff, flex_rms (float), ext_rms (float)]
  uint8_t buf[12] = {1, 12, 100, (uint8_t)effort, 0,0,0,0, 0,0,0,0};
  memcpy(&buf[4], &rms, 4); // Flexor RMS
  float zero = 0;
  memcpy(&buf[8], &zero, 4); // Extensor omitted for MVP
  pChrEmgState->setValue(buf, 12);
  pChrEmgState->notify();
}

// ═══════════════════════════════════════════════════════════════
// SETUP & LOOP
// ═══════════════════════════════════════════════════════════════
class ServerCallbacks: public NimBLEServerCallbacks {
    void onConnect(NimBLEServer* pServer) { deviceConnected = true; }
    void onDisconnect(NimBLEServer* pServer) { deviceConnected = false; targetTemp = 0; setMotors(0,0,0,0); analogWrite(PIN_HEATER, 0); }
};

void setup() {
  Serial.begin(115200);
  
  pinMode(PIN_HEATER, OUTPUT);
  pinMode(PIN_MOTOR_IDX, OUTPUT);
  pinMode(PIN_MOTOR_MID, OUTPUT);
  pinMode(PIN_MOTOR_RNG, OUTPUT);
  pinMode(PIN_MOTOR_PNK, OUTPUT);
  analogReadResolution(12);

  NimBLEDevice::init("Exodia Stage Hand");
  pServer = NimBLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  // Thermal Service
  NimBLEService* pSvcT = pServer->createService(THERMAL_SERVICE);
  pSvcT->createCharacteristic(THERMAL_MODE, NIMBLE_PROPERTY::WRITE)->setCallbacks(new ThermalCallbacks());
  pChrThermState = pSvcT->createCharacteristic(THERMAL_STATE, NIMBLE_PROPERTY::NOTIFY);
  pSvcT->createCharacteristic(THERMAL_REACTION, NIMBLE_PROPERTY::WRITE)->setCallbacks(new ThermalCallbacks());
  pSvcT->start();

  // Hand Service
  NimBLEService* pSvcH = pServer->createService(HAND_SERVICE);
  pSvcH->createCharacteristic(HAND_CONFIG, NIMBLE_PROPERTY::WRITE)->setCallbacks(new HandCallbacks());
  pSvcH->createCharacteristic(CHORD_TARGET, NIMBLE_PROPERTY::WRITE)->setCallbacks(new HandCallbacks());
  pSvcH->createCharacteristic(ASSIST_LEVEL, NIMBLE_PROPERTY::WRITE);
  pChrEmgState = pSvcH->createCharacteristic(EMG_STATE, NIMBLE_PROPERTY::NOTIFY);
  pSvcH->createCharacteristic(HAPTIC_EVENT, NIMBLE_PROPERTY::WRITE)->setCallbacks(new HandCallbacks());
  pSvcH->start();

  NimBLEAdvertising* pAdv = NimBLEDevice::getAdvertising();
  pAdv->addServiceUUID(THERMAL_SERVICE);
  pAdv->addServiceUUID(HAND_SERVICE);
  pAdv->start();
}

unsigned long lastT = 0;
unsigned long lastE = 0;

void loop() {
  processThermal();

  if (millis() - lastT >= 500) {
    if (deviceConnected) {
      uint8_t buf[8] = {1, 8, 0,0,0,0, 100, thermalStatus, faultCode};
      memcpy(&buf[1], &currentTempC, 4);
      pChrThermState->setValue(buf, 8);
      pChrThermState->notify();
    }
    lastT = millis();
  }

  if (millis() - lastE >= 100) { // 10Hz EMG
    processEMG();
    lastE = millis();
  }
}
