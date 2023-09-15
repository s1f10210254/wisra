import {SERVO,setup} from './src/sample'

setup('COM4');

const servo = SERVO(9);
servo.setAngle(90);