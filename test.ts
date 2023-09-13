import {LED, setup} from './src/index'

setup('COM4');
const led = LED(13);
led.blink()