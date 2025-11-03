#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ------------------ WiFi Config ------------------
const char* ssid = "vivoV27";
const char* password = "Sai12345";
const char* serverURL = "http://10.59.199.224:5000/log"; // Flask endpoint
// --------------------------------------------------

// ------------------ Pin Mapping -------------------
#define TRIG_PIN 12
#define ECHO_PIN 14
#define PHOTO_PIN 27
#define LED_PHOTO 26
#define BOOK1_PRESENT 33
#define BOOK2_PRESENT 25
#define RECEIVER 34
// --------------------------------------------------

int detect_movement();
void book();
void check_book_present();
float duty_cycle();
void sendBookStatus(String position, String status, float duty);
void IRAM_ATTR risingEdge();
void IRAM_ATTR fallingEdge();

// ------------------ Variables --------------------
float duty;
int book_present[2] = {0, 0};       // Current state
int prev_book_present[2] = {0, 0};  // Previous state
String book_names[2] = {"A", "B"};

// ---------- Duty Cycle Measurement Variables ----------
volatile unsigned long riseTime = 0;
volatile unsigned long fallTime = 0;
volatile unsigned long highTime = 0;
volatile unsigned long lowTime = 0;
volatile bool newCycle = false;
// ------------------------------------------------------

// ------------------------------------------------------
// Setup
// ------------------------------------------------------
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\nESP32 initialized (WiFi + HTTP + JSON)");

  // WiFi setup
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_PHOTO, OUTPUT);
  pinMode(PHOTO_PIN, OUTPUT);
  pinMode(BOOK1_PRESENT, INPUT_PULLUP);
  pinMode(BOOK2_PRESENT, INPUT_PULLUP);
  pinMode(RECEIVER, INPUT);

  attachInterrupt(RECEIVER, risingEdge, RISING);
}

// ------------------------------------------------------
// Main Loop
// ------------------------------------------------------
void loop() {
  int motion = detect_movement();

  if (motion) {
    delay(500);
    digitalWrite(LED_PHOTO, HIGH);
    digitalWrite(PHOTO_PIN, HIGH);

    book();               // check book presence
    check_book_present(); // compare and send JSON
  } else {
    digitalWrite(LED_PHOTO, LOW);
    digitalWrite(PHOTO_PIN, LOW);
  }

  delay(200);
}

// -----------------------------------------------------------
// Compare book states and send update if changed
// -----------------------------------------------------------
void check_book_present() {
  duty = duty_cycle(); // measure latest duty cycle

  for (int i = 0; i < 2; i++) {
    if (book_present[i] != prev_book_present[i]) {
      String action = (book_present[i] == 1) ? "placed" : "removed";
      Serial.printf("\n[EVENT] Book %s was %s\n", book_names[i].c_str(), action.c_str());

      // Send JSON update
      sendBookStatus(book_names[i], action, duty);

      // Update stored state
      prev_book_present[i] = book_present[i];
    }
  }

  if (book_present[0] == 0 && book_present[1] == 0) {
    Serial.println("No book present");
  }
}

// -----------------------------------------------------------
// Send JSON data to server and print it
// -----------------------------------------------------------
void sendBookStatus(String position, String status, float duty) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected, skipping POST");
    return;
  }

  HTTPClient http;
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<200> doc;
  doc["position"] = position;
  doc["status"] = status;
  doc["duty_cycle"] = duty;

  String payload;
  serializeJson(doc, payload);

  // ✅ Print JSON payload to Serial
  Serial.println("\n--- JSON to send ---");
  Serial.println(payload);
  Serial.println("--------------------");

  int httpResponseCode = http.POST(payload);

  if (httpResponseCode > 0) {
    Serial.print("HTTP POST → ");
    Serial.println(httpResponseCode);
  } else {
    Serial.print("HTTP POST failed → ");
    Serial.println(httpResponseCode);
  }

  http.end();
}

// -----------------------------------------------------------
// Function to measure duty cycle
// -----------------------------------------------------------
float duty_cycle() {
  if (newCycle) {
    noInterrupts();
    unsigned long copyHigh = highTime;
    unsigned long copyLow = lowTime;
    newCycle = false;
    interrupts();

    unsigned long period = copyHigh + copyLow;
    if (period > 0) {
      return (copyHigh * 100.0) / period;
    }
  }
  return 0;
}

// -----------------------------------------------------------
// Interrupt Service Routines
// -----------------------------------------------------------
void IRAM_ATTR risingEdge() {
  unsigned long now = micros();

  if (fallTime != 0) {
    lowTime = now - fallTime;
    newCycle = true;
  }

  riseTime = now;
  attachInterrupt(RECEIVER, fallingEdge, FALLING);
}

void IRAM_ATTR fallingEdge() {
  unsigned long now = micros();
  highTime = now - riseTime;
  fallTime = now;
  attachInterrupt(RECEIVER, risingEdge, RISING);
}

// -----------------------------------------------------------
// Book presence checking
// -----------------------------------------------------------
void book() {
  for (int i = 0; i < 2; i++) {
    delay(200);
    int pin = (i == 0) ? BOOK1_PRESENT : BOOK2_PRESENT;
    int k = digitalRead(pin);
    book_present[i] = (k == LOW) ? 1 : 0;
  }

  Serial.printf("Book Status -> A: %d, B: %d\n", book_present[0], book_present[1]);
}

// -----------------------------------------------------------
// Ultrasonic movement detection
// -----------------------------------------------------------
int detect_movement() {
  long duration;
  float distanceCm;

  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  duration = pulseIn(ECHO_PIN, HIGH, 30000);
  distanceCm = (duration * 0.0343) / 2.0;

  delay(50);
  return (distanceCm > 0 && distanceCm < 50) ? 1 : 0;
}