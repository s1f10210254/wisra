import { Led } from "./src/types/LED";
import { ServoMotor } from "./src/types/ServoMoter";

// write here all pin mode 
export type Output = Led 
export type Servo = ServoMotor

export type Mode = 'Servo' | 'Output' | 'Input' | 'Pwm' ;