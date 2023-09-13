import { error } from "console";
import { SerialPort } from "serialport"

let path: string = 'COM3';

export function setup(mypath: string){
    path = mypath;
}

export function LED(pinNumber: number){
    const port = new SerialPort({path ,baudRate: 57600});

    const identifierCode = 0x90;
    let isOn = false;

    function blink(interval: number = 1000):void{

        setTimeout(()=>{
            setInterval(()=>{
                isOn = !isOn;
    
                const bufferValue = isOn ? (1 << (pinNumber & 0x07)) : 0x00;
                const buffer = Buffer.from([identifierCode + (pinNumber >> 3), bufferValue, 0x00]);
                port.write(buffer, (err)=>{
                    if(err){
                        return console.error('Error writing to port: ', err.message);
                    }
                    console.log(`LED ${isOn ? 'on' : 'off'} at pin ${pinNumber}`);
                });
            }, interval)
        },2500)
        
    }

    function on() {

        const buffer = Buffer.from([identifierCode + (pinNumber >> 3), (1 << (pinNumber & 0x07)), 0x00])
        port.write(buffer, (err)=>{
            if(err){
                return console.error('Error writing to port: ', err.message);
            }
            console.log(`LED on at pin ${pinNumber}`)
        })
    }

    function off(){
        const buffer = Buffer.from([identifierCode + (pinNumber >> 3), 0x00, 0x00])
        port.write(buffer, (err)=>{
            if(err){
                return console.error('Error writing to port: ', err.message);
            }
            console.log(`LED on at pin ${pinNumber}`)
        })
    }

    port.on('open', ()=>{
        console.log('Arduino connected');
    });

    port.on('error', (err)=>{
        console.error('Error', err);
    });


    return {
        blink,
        on,
        off,
    }
}