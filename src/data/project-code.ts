// Raw source code embedded for in-portfolio viewing.
// Each project may expose one or more code files.

export type CodeFile = { name: string; language: string; code: string };

export const R2R_CODE: CodeFile[] = [
  {
    name: "r2r_dac.ino",
    language: "cpp",
    code: `void setup() {
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  for (int i = 0; i < 16; i++) {
    digitalWrite(2, (i >> 3) & 1); // MSB
    digitalWrite(3, (i >> 2) & 1);
    digitalWrite(4, (i >> 1) & 1);
    digitalWrite(5, i & 1);        // LSB

    int value = analogRead(A3);
    Serial.println(value);
    delay(200);
  }
}`,
  },
];

export const PID_CODE: CodeFile[] = [
  {
    name: "PID_1_motor_encoder_test.ino",
    language: "cpp",
    code: `// ============================================
// STAGE 1: Motor + Encoder Test
// Verify both motor and encoder work correctly
// Before attempting PID
// ============================================

#define RPWM 9        // PWM pin to BTS7960
#define R_EN 10       // Enable pin (if not hardwired to 5V)

#define ENCODER_A 2   // Encoder Channel A → Interrupt pin
#define ENCODER_B 3   // Encoder Channel B → Interrupt pin

volatile long encoderCount = 0;  // Counts encoder pulses
long lastCount = 0;
float rpm = 0;

// ── Interrupt Service Routine ──
// Called every time encoder A rises
void IRAM_ATTR encoderISR() {
  if (digitalRead(ENCODER_B) == HIGH) {
    encoderCount++;   // Forward
  } else {
    encoderCount--;   // Backward
  }
}

void setup() {
  Serial.begin(9600);

  // Motor pins
  pinMode(RPWM, OUTPUT);

  // Encoder pins
  pinMode(ENCODER_A, INPUT_PULLUP);
  pinMode(ENCODER_B, INPUT_PULLUP);

  // Attach interrupt on Encoder A
  attachInterrupt(digitalPinToInterrupt(ENCODER_A), encoderISR, RISING);

  Serial.println("=== Stage 1: Motor + Encoder Test ===");
  Serial.println("Motor spinning at 50% speed...");

  // Spin motor at 50%
  analogWrite(RPWM, 128);
}

void loop() {
  // Calculate RPM every 500ms
  delay(500);

  long currentCount = encoderCount;
  long pulses = currentCount - lastCount;
  lastCount = currentCount;

  // RPM formula:
  // pulses in 500ms → multiply by 2 for per second → divide by PPR → multiply by 60
  // We use 360 as estimated PPR — will calibrate in Stage 2
  float estimatedPPR = 360.0;
  rpm = (pulses / estimatedPPR) * 2.0 * 60.0;

  Serial.print("Encoder Count: ");
  Serial.print(currentCount);
  Serial.print("  |  RPM: ");
  Serial.println(rpm);
}`,
  },
  {
    name: "PID_2_ppr_calibration.ino",
    language: "cpp",
    code: `// ============================================
// STAGE 2: PPR Calibration
// Rotate motor exactly 1 full revolution
// Count pulses → that is your real PPR
// ============================================

#define RPWM 9
#define ENCODER_A 2
#define ENCODER_B 3

volatile long encoderCount = 0;
bool motorRunning = false;
bool calibrationDone = false;

void encoderISR() {
  if (digitalRead(ENCODER_B) == HIGH) {
    encoderCount++;
  } else {
    encoderCount--;
  }
}

void setup() {
  Serial.begin(9600);
  pinMode(RPWM, OUTPUT);
  pinMode(ENCODER_A, INPUT_PULLUP);
  pinMode(ENCODER_B, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(ENCODER_A), encoderISR, RISING);

  Serial.println("=== Stage 2: PPR Calibration ===");
  Serial.println("Instructions:");
  Serial.println("1. Mark a point on your motor shaft with a pen");
  Serial.println("2. Send 'S' in Serial Monitor to START motor");
  Serial.println("3. When shaft completes ONE full rotation, send 'X' to STOP");
  Serial.println("4. Read the PPR value shown");
}

void loop() {
  if (Serial.available()) {
    char cmd = Serial.read();

    // Start motor
    if (cmd == 'S' || cmd == 's') {
      encoderCount = 0;
      motorRunning = true;
      analogWrite(RPWM, 80); // Slow speed for accurate calibration
      Serial.println("Motor started! Watch the shaft...");
      Serial.println("Send 'X' when exactly ONE full rotation completes.");
    }

    // Stop motor and show PPR
    if (cmd == 'X' || cmd == 'x') {
      analogWrite(RPWM, 0);
      motorRunning = false;

      Serial.println("==============================");
      Serial.print("Your PPR = ");
      Serial.println(abs(encoderCount));
      Serial.println("Note this value for Stage 3 PID code!");
      Serial.println("==============================");
    }
  }
}`,
  },
  {
    name: "PID_3_full_pid_control.ino",
    language: "cpp",
    code: `// ============================================
// STAGE 3: Full PID Speed + Position Control
// Speed PID  → maintains target RPM
// Position PID → rotates exact degrees
// ============================================

#define RPWM 9
#define ENCODER_A 2
#define ENCODER_B 3

// ── Replace with your PPR from Stage 2 ──
#define PPR 1420

// ── PID Gains — tune these ──
float Kp_speed = 1.0;
float Ki_speed = 0.8;
float Kd_speed = 0.0;

float Kp_pos = 3.0;
float Ki_pos = 0.0;
float Kd_pos = 0.2;

// ── Encoder ──
volatile long encoderCount = 0;

// ── PID variables ──
float speedError = 0, speedPrevError = 0, speedIntegral = 0;
float posError = 0,   posPrevError = 0,   posIntegral = 0;

// ── Timing ──
unsigned long lastTime = 0;
long lastEncoderCount = 0;

// ── Mode ──
// 0 = Speed Control
// 1 = Position Control
int mode = 0;

// ── Targets ──
float targetRPM = 50.0;          // Target speed in RPM
long targetPosition = 0;         // Target position in encoder pulses

void encoderISR() {
  if (digitalRead(ENCODER_B) == HIGH) {
    encoderCount++;
  } else {
    encoderCount--;
  }
}

// ── Apply PWM safely ──
void setMotorPWM(int pwm) {
  pwm = constrain(pwm, 0, 255);
  analogWrite(RPWM, pwm);
}

// ── Degrees to pulses ──
long degreesToPulses(float degrees) {
  return (long)((degrees / 360.0) * PPR);
}

void setup() {
  Serial.begin(9600);
  pinMode(RPWM, OUTPUT);
  pinMode(ENCODER_A, INPUT_PULLUP);
  pinMode(ENCODER_B, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(ENCODER_A), encoderISR, RISING);

  Serial.println("=== Stage 3: PID Motor Control ===");
  Serial.println("Commands:");
  Serial.println("  S<value>  → Set speed RPM    (e.g. S50)");
  Serial.println("  P<value>  → Set position deg (e.g. P360)");
  Serial.println("  X         → Stop motor");
  Serial.println("  R         → Reset encoder count");
  Serial.println("===================================");

  lastTime = millis();
}

void loop() {
  // ── Read Serial Commands ──
  if (Serial.available()) {
    String input = Serial.readStringUntil('\\n');
    input.trim();
    char cmd = input.charAt(0);
    float value = input.substring(1).toFloat();

    if (cmd == 'S' || cmd == 's') {
      mode = 0;
      targetRPM = value;
      speedIntegral = 0;
      Serial.print("Speed mode → Target RPM: ");
      Serial.println(targetRPM);
    }

    if (cmd == 'P' || cmd == 'p') {
      mode = 1;
      encoderCount = 0;   // Reset position
      targetPosition = degreesToPulses(value);
      posIntegral = 0;
      Serial.print("Position mode → Target degrees: ");
      Serial.print(value);
      Serial.print(" = ");
      Serial.print(targetPosition);
      Serial.println(" pulses");
    }

    if (cmd == 'X' || cmd == 'x') {
      setMotorPWM(0);
      Serial.println("Motor stopped.");
    }

    if (cmd == 'R' || cmd == 'r') {
      encoderCount = 0;
      Serial.println("Encoder reset to 0.");
    }
  }

  // ── PID Loop runs every 100ms ──
  unsigned long now = millis();
  if (now - lastTime >= 100) {
    float dt = (now - lastTime) / 1000.0; // seconds
    lastTime = now;

    // ── Speed PID ──
    if (mode == 0) {
      long currentCount = encoderCount;
      long pulses = currentCount - lastEncoderCount;
      lastEncoderCount = currentCount;

      float currentRPM = (pulses / (float)PPR) * (60.0 / dt);

      speedError    = targetRPM - currentRPM;
      speedIntegral += speedError * dt;
      float speedDerivative = (speedError - speedPrevError) / dt;
      speedPrevError = speedError;

      float output = (Kp_speed * speedError)
                   + (Ki_speed * speedIntegral)
                   + (Kd_speed * speedDerivative);

      setMotorPWM((int)output);

      // ── Serial Plotter output ──
      Serial.print("Target:");
      Serial.print(targetRPM);
      Serial.print(" RPM:");
      Serial.print(currentRPM);
      Serial.print(" PWM:");
      Serial.println((int)constrain(output, 0, 255));
    }

    // ── Position PID ──
    if (mode == 1) {
      long currentPos = encoderCount;

      posError    = targetPosition - currentPos;
      posIntegral += posError * dt;
      float posDerivative = (posError - posPrevError) / dt;
      posPrevError = posError;

      float output = (Kp_pos * posError)
                   + (Ki_pos * posIntegral)
                   + (Kd_pos * posDerivative);

      // Stop if close enough (within 5 pulses)
      if (abs(posError) <= 5) {
        setMotorPWM(0);
        Serial.println("Position reached!");
      } else {
        setMotorPWM((int)output);
      }

      // ── Serial Plotter output ──
      Serial.print("Target:");
      Serial.print(targetPosition);
      Serial.print(" Position:");
      Serial.print(currentPos);
      Serial.print(" Error:");
      Serial.println(posError);
    }
  }
}`,
  },
];
