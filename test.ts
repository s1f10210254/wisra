// import {LED, setup} from './src/index'

// setup('COM4');
// const led = LED(13);
// led.blink(3000)

// led.on();
import {setup, LED,SERVO} from './src/sample'

setup('COM4')
// const myLED = LED(13);

// myLED.blink();

// myLED.blink()
// myLED.on()
// myLED.off()
const servo = SERVO(10);
servo.configureServo(1000,2000)
servo.setAngle(90)

setTimeout(()=>{
    servo.setAngle(45);
},2000)
