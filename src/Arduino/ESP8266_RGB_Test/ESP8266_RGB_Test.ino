#include <ESP8266.h>
#include <SoftwareSerial.h>

#define SSID "aterm-81a8df-g"
#define PASSWORD "1d71de23cfeff"
#define HOST_NAME "192.168.0.13"
#define HOST_PORT 80

SoftwareSerial mySerial(12, 11); //RX, TX
ESP8266 wifi(mySerial);

void setup() {
  pinMode(7, INPUT_PULLUP);

  Serial.begin(9600);
  mySerial.begin(9600);
  while (!Serial) {}

  Serial.println("Ready");

  if (wifi.setOprToStationSoftAP()) {
    Serial.println("To Station OK");
  } else {
    Serial.println("To Station NG");
  }

  if (wifi.joinAP(SSID, PASSWORD)) {
    Serial.println("Join AP OK");
  } else {
    Serial.println("Join AP Error");
  }

  if (wifi.disableMUX()) {
    Serial.println("Disable MUX OK");
  } else {
    Serial.println("Disable MUX Error");
  }

  Serial.print("FW Version: ");
  Serial.println(wifi.getVersion().c_str());
  Serial.print("IP: ");
  Serial.println(wifi.getLocalIP());
  
  Serial.println("Setup Finished");
}

int red   = 0;
int green = 0;
int blue  = 0;

void loop() {
  red   = (255 - map(analogRead(0), 0, 1023, 0, 255));
  green = (255 - map(analogRead(1), 0, 1023, 0, 255));
  blue  = (255 - map(analogRead(2), 0, 1023, 0, 255));

  //String query = "a=1,b=2";
  String query = stringify(red, green, blue);
  String cmd = "GET /rgb?";
  cmd += query;
  cmd += " HTTP/1.1\r\nHost: ";
  cmd += HOST_NAME;
  cmd += "\r\nUser-Agent: Arduino\r\n\r\n ";
  int LEN = cmd.length();
  char c[LEN];
  cmd.toCharArray(c, LEN);
  
  if (digitalRead(7) == LOW) {
    Serial.println("===== [Command] =====");
    Serial.println(cmd);
    Serial.println("=====================");

    wifi.createTCP(HOST_NAME, HOST_PORT);
    wifi.send(c, LEN);
  }

  delay(200);
}

String stringify(int R, int G, int B) {
  String result = "red=";
  result += R;
  result += "&green=";
  result += G;
  result += "&blue=";
  result += B;

  return result;
}
