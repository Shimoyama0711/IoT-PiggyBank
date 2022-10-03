/*
 * LiquidCrystal and LBR-127HLD
 *
 */

#include <LiquidCrystal.h>
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

void setup() {
  lcd.begin(16, 2);
  lcd.clear();
  lcd.setCursor(0, 0);
}

void loop() {
  int val = analogRead(0);
  
  lcd.setCursor(0, 0);
  lcd.print("Photo Reflector");
  lcd.setCursor(0, 1);
  lcd.print("Val:");
  lcd.print(val);
  delay(100);
  lcd.clear();
}
