import { SerialPort } from "serialport";

const path = 'COM4'
const port = new SerialPort({path, baudRate:57600});

const pinNumber = 9;
const setServoPinmode =()=>{
    const PIN_MODE_SERVO = 0x04;
    const SET_PIN_MODE = 0xF4;
    const buffer = Buffer.from([SET_PIN_MODE, pinNumber, PIN_MODE_SERVO])
    port.write(buffer,(err)=>{
        if(err){
            console.error("setSERVO PIN MODE ERROR: " ,err?.message)
        }
        console.log("SERVO MODE OUTPUT CONNECT")
    })
    
}

const setServoAngle=(angle: number)=>{
    const ANALOG_MESSAGE = 0xE0;
    if(angle < 0) angle = 0;
    if(angle > 180) angle = 180;
    const buffer = Buffer.from([ANALOG_MESSAGE | pinNumber, angle & 0x7F, (angle >> 7) & 0x7F]);
    port.write(buffer,(err)=>{
        if(err){
            console.error("setAngle ERROR: ",err?.message)
        }
    })
}

port.on('open', ()=>{
    console.log('Arduino connected');
})

port.on('error', (err) => {
    console.error('Error', err);
});