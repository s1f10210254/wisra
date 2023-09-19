import { SerialPort } from "serialport";

export function setServoSpeed(pinNumber:number,speed : number, port:SerialPort): Promise<void>{
    const Pin = pinNumber;
    const data = [
        0xE0 | Pin,
        speed & 0x7F,
        (speed >> 7) & 0x7F
    ];

    return new Promise((resolve,reject)=>{
        port.write(Buffer.from(data),(err)=>{
            if(err){
                console.error("Error",err.message)
                reject(err)
            }else{
                console.log(`set to speed ${speed} at pin ${pinNumber}`);
                resolve()
            }
            
        })
    })
    

}