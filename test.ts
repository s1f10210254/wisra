// // import {SERVO,setup} from './src/sample'

// // setup('COM4');
// import { LED, setup } from "./src/index";
// // const led = LED(13);
// setup('COM4')

// LED.toString()

import {setup , LED, Servo} from "./src/sample"

setup('COM4')
// const led = LED(11)
// led.on()

const servo = Servo(9);
servo.Angle(0);