import { error } from "console";
import * as readline from "readline"
import { SerialPort } from "serialport"

let path: string = 'COM3';

export function setup(mypath: string){
    path = mypath;
}

export function LED(pinNumber: number){
    const port = new SerialPort({path ,baudRate: 57600});

    const identifierCode = 0x90;
    let isOn = false;
    let blinkingInterval: NodeJS.Timeout | null = null

    port.on('open', ()=>{
        console.log('Arduino connected');
    });

    port.on('error', (err)=>{
        console.error('Error', err);
    });

    function keepConsoleOpen(){
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        console.log('Press ENTER to exit...');

        rl.on('line', ()=>{
            if(blinkingInterval){
                clearInterval(blinkingInterval);
            }
            off();
            rl.close();
            process.exit(0);
        })
    }

    function on() {
        isOn = true;
        const bufferValue = 1 << (pinNumber & 0x07);
        const buffer = Buffer.from([identifierCode + (pinNumber >> 3), bufferValue, 0x00])
        port.write(buffer, (err)=>{
            if(err){
                return console.error('Error writing to port: ', err.message);
            }
            console.log(`LED on at pin ${pinNumber}`)
        })
        keepConsoleOpen()
    }

    function off(){
        isOn = false;
        const buffer = Buffer.from([identifierCode + (pinNumber >> 3), 0x00, 0x00])
        port.write(buffer, (err)=>{
            if(err){
                return console.error('Error writing to port: ', err.message);
            }
            console.log(`LED off at pin ${pinNumber}`)
        })
    }

    function blink(interval: number = 1000){
        blinkingInterval = setInterval(()=>{
            isOn ? off() : on();
        },interval);
    }

    return {
        blink,
        on,
        off,
    }
}