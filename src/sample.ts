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

// export function SERVO(pinNumber: number){
//     const port = new SerialPort({path ,baudRate: 57600});
    
//     port.on("open", ()=>{
//         console.log("Arduino connected");
//     });

//     port.on("error", (err)=>{
//         console.error("Error", err.message);
//     })
//     function configureServo(minPulse: number, maxPulse:number){
//         const commandByte = 0x70;
//         const dataByte = [
//             pinNumber,
//             minPulse & 0x7F, (minPulse >> 7) & 0x7F,
//             maxPulse & 0x7F, (maxPulse >> 7) & 0x7F,
//         ]

//         const buffer = Buffer.from([commandByte, ...dataByte]);
//         port.write(buffer);
//     }

//     function setAngle (angle : number){
//         if (angle < 0) angle = 0;
//         if (angle > 180) angle = 180;

//         const commandByte = 0xE0 | (pinNumber & 0x0F);
//         const dataByte = [(angle & 0x7F), (angle >> 7) & 0x7F];

//         const buffer = Buffer.from([commandByte, ...dataByte]);
//         port.write(buffer, (err)=>{
//             if(err){
//                 return console.error("Error writing to port: ",err.message);
//             }
//             console.log(`Set Servo at pin ${pinNumber} to angle ${angle} degrees`);
//         });
//     }
//     return {
//         configureServo,
//         setAngle
//     }
// }

export function SERVO(pinNumber :number){
    const port = new SerialPort({path, baudRate:57600})

    port.on("open", ()=>{
        console.log("Arduino connected");
    })
    
    port.on("error", (err)=>{
        console.error("Error", err);
    })

    function setPinOutput(){
        const PIN_MODE_SERVO = 0x04;
        const SET_PIN_MODE = 0xF4;
        const buffer = Buffer.from([SET_PIN_MODE, pinNumber,PIN_MODE_SERVO]);
        port.write(buffer)
    }

    function setAngle(angle : number){
        setPinOutput();

        const ANALOG_MESSAGE = 0xE4;
        if(angle < 0) angle = 0;
        if(angle > 180) angle = 0;
        const buffer = Buffer.from([ANALOG_MESSAGE | pinNumber, angle & 0x7F, (angle >> 7) & 0x7F])
        // port.write(buffer);
        setTimeout(()=>{
            port.write(buffer, (err)=>{
                if(err){
                    return console.error("Error writing to port: ",err.message)
                }
                console.log(`Set Servo at pin ${pinNumber} to angle ${angle} degrees`)
            })
        },2000)
    }

    function initialize(){
        setPinOutput();
    }

    return {
        // initialize,
        setAngle,
    }
}