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
            offProcess();
            rl.close();
            process.exit(0);
        })
    }
    function setPinOutput(){
        const setPinModeOutput = Buffer.from([0xF4, 13, 1]);
        port.write(setPinModeOutput);
    }

    // function blink(interval: number = 1000):void{
    //     setTimeout(()=>{
    //         setInterval(()=>{
    //             isOn = !isOn;

    //             const bufferValue = isOn ? 1 <<(pinNumber & 0x07) : 1 << (0x00);
    //             const buffer = Buffer.from([identifierCode + (pinNumber >> 3), bufferValue, 0x00]);
    //             port.write(buffer, (err)=>{
    //                 if(err){
    //                     return console.error('Error writing to port: ', err.message);
    //                 }
    //                 console.log(`LED ${isOn ? 'on' : 'off'} at pin ${pinNumber}`);
    //             })
    //         },interval)
    //     },2000)
    //     keepConsoleOpen();
    // }

    function blink(interval: number = 1000):void{
        setPinOutput();

        setTimeout(()=>{
            setInterval(()=>{
                isOn ? offProcess() : onProcess();
            },interval)
        },2000);
        keepConsoleOpen()
    }

    const onProcess = ()=>{
        isOn = true;
        const bufferValue = 1 << (pinNumber & 0x07);
        const buffer = Buffer.from([identifierCode + (pinNumber >> 3), bufferValue, 0x00]);
        port.write(buffer, (err)=>{
            if(err){
                return console.error('Error writing to port: ', err.message);
            }
            console.log(`LED on at pin ${pinNumber}`);
        })
    }

    const offProcess = ()=>{
        isOn = false;
        const bufferValue = 1 << (0x00);
        const buffer = Buffer.from([identifierCode + (pinNumber >> 3), bufferValue, 0x00]);
        port.write(buffer, (err) => {
            if (err) {
                return console.error('Error writing to port: ', err.message);
            }
            console.log(`LED off at pin ${pinNumber}`);
        });
    }

    function on(){
        setPinOutput()

        setTimeout(()=>{
            onProcess()
        },2000)
        keepConsoleOpen()
    }

    function off(){
        setPinOutput();
        offProcess();
    }


    

    return {
        blink,
        on,
        off,
    }
}