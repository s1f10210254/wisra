import { SerialPort } from "serialport";

export function setServoAngle(pinNumber:number,angle : number, port:SerialPort): Promise<void>{
    const Pin = pinNumber;
    const data = [
        0xE0 | Pin,
        angle & 0x7F,
        (angle >> 7) & 0x7F
    ];

    return new Promise((resolve,reject)=>{
        port.write(Buffer.from(data),(err)=>{
            if(err){
                console.error("Error",err.message)
                reject(err)
            }else{
                console.log(`set to Angle ${angle} at pin ${pinNumber}`);
                resolve()
            }
            
        })
    })
    

}