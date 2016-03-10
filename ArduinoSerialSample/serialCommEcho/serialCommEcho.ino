const int SERIAL_SPEED = 9600;
const byte pin = 13;
String receivedString = "";
boolean stringComplete = false;

unsigned long time;
unsigned long lastTime;

void setup() {
  pinMode(pin, OUTPUT);
  receivedString.reserve(256);  
  Serial.begin(SERIAL_SPEED, SERIAL_8N1);
  Serial.write("ready#");
}

void loop() {
  
  time = millis();
  
  if (stringComplete) {
    float temp = receivedString.toFloat();
    setTemp(temp);    
    receivedString = "";
    stringComplete = false;
  }

  if (time - lastTime > 3000){
    readHumidity();
  }
}

void serialEvent()
{
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();

    // if the incoming character is a newline, set a flag
    // so the main loop can do something about it:
    if (inChar == '#') {
      stringComplete = true;
    } else {
      receivedString += inChar;
    }
  }
}

void setTemp(float target){
   Serial.write("Temp set");   
   Serial.write("#");
}

void readHumidity(){
  lastTime = millis();
  int humidity = random(20, 30);
  String h = String(humidity);
  Serial.write("H ");
  Serial.write(h.c_str());
  Serial.write("#");
}
