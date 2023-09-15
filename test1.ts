import { SerialPort } from "serialport";

const path = 'COM4'
const port = new SerialPort({path, baudRate:57600});

const pinNumber = 9;
const setServoPinmode =()=>{
    const PIN_MODE_SERVO = 0x04;
    const SET_PIN_MODE = 0xF4;
    const buffer = Buffer.from([SET_PIN_MODE, pinNumber, PIN_MODE_SERVO])
    console.log("Sending buffer for setServoPinmode:", buffer);
    port.write(buffer,(err)=>{
        if(err){
            console.error("setSERVO PIN MODE ERROR: " ,err?.message)
        }
        console.log("SERVO MODE OUTPUT CONNECT")
    })
    
}

const setServoConfig = () =>{
    const SERVO_CONFIG = 0x70;
    const MIN_PULSE = 544;
    const MAX_PULSE = 2400;
    const buffer = Buffer.from([
        SERVO_CONFIG,
        pinNumber,
        MIN_PULSE & 0x7F, (MIN_PULSE >> 7) & 0x7F,
        MAX_PULSE & 0x7F, (MAX_PULSE >> 7) & 0x7F
    ]);

    port.write(buffer, (err)=>{
        if(err){
            console.error("setSevoConfig Error: ", err.message );
        }
        console.log(`Servo config set on pin ${pinNumber}`);
    })
}

const setServoAngle=(angle: number)=>{
    const ANALOG_MESSAGE = 0xE0;
    if(angle < 0) angle = 0;
    if(angle > 180) angle = 180;
    const buffer = Buffer.from([ANALOG_MESSAGE | pinNumber, angle & 0x7F, (angle >> 7) & 0x7F]);

    console.log("Sending buffer for setServoAngle:", buffer);

    port.write(buffer,(err)=>{
        if(err){
            console.error("setAngle ERROR: ",err.message)
        }
        console.log(`SetAngle ${angle} at pin ${pinNumber}`)
    })
}

port.on('open', ()=>{
    console.log('Arduino connected');
    setServoPinmode();
    setTimeout(()=>{
        setServoConfig();
        setTimeout(()=>{
            setServoAngle(10);
        },2000)
    },2000)
})

port.on('error', (err) => {
    console.error('Error', err);
});