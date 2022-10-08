#include <SoftwareSerial.h>
SoftwareSerial wifi(12, 11); //RX, TX

void setup() {
  Serial.begin(115200);

  while (!Serial) {
    ;
  }

  Serial.println("Startup");
  wifi.begin(115200);
}

void loop() {
  if (wifi.available()) {
    Serial.write(wifi.read());
  }

  if (Serial.available()) {
    wifi.write(Serial.read());
  }
}
