import {LED, setup} from './src/index'

setup('COM4');
const led = LED(13);
led.blink(3000)

// led.on();
// import {setup, LED} from './src/sample'

// setup('COM4')
// const myLED = LED(13);

// // myLED.blink()

// myLED.on();