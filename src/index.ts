import { SerialPort } from "serialport"

// interface LEDOptions {
//     path?: string;
//     baudRate?: number;
// }

// class LED {
//     private pin: number;
//     private identifierCode = 0x90;
//     private isOn = false;
//     private path: string;
//     private baudRate = 57600;
//     private port: SerialPort;

//     constructor(pin: number, options: LEDOptions = {}){
//         this.pin = pin;

//         this.path = options.path || 'COM3';
//         this.baudRate = options.baudRate || 57600;

//         this.port = new SerialPort({ path: this.path, baudRate: this.baudRate });

//         this.port.on('open', ()=>{
//             console.log('Arduino connected');
//         });

//         this.port.on('error', (err)=>{
//             console.error('Error', err)
//         });
//     }

//     blink(): void{
//         setInterval(()=>{
//             this.toggle();
//         },1000);
//     }

//     private toggle(): void{
//         this.isOn = !this.isOn;
//         const bufferValue = this.isOn ? (1 << (this.pin & 0x07)) : 0x00;
//         const buffer = Buffer.from([this.identifierCode + (this.pin >> 3), bufferValue, 0x00]);

//         this.port.write(buffer,(err)=>{
//             if(err){
//                 return console.error('Error writing to port: ', err.message);
//             }
//             console.log(`Sent message to turn ${this.isOn ? 'on' : 'off'} LED at pin ${this.pin}`);
//         });
//     }
// }


// export { LED }

let path: string = 'COM3';

export function setup(path: string){
    path = path;
}

export function LED(pinNumber: number){
    const port = new SerialPort({path ,baudRate: 57600});

    const identifierCode = 0x90;
    let isOn = false;
    let intervalID: NodeJS.Timeout;

    function blink(duration: number = 1000):void{
        if(intervalID){
            clearInterval(intervalID)
        }

        intervalID = setInterval(()=>{
            isOn = !isOn;

            const bufferValue = isOn ? (1 << (pinNumber & 0x07)) : 0x00;
            const buffer = Buffer.from([identifierCode + (pinNumber >> 3), bufferValue, 0x00]);
            port.write(buffer, (err)=>{
                if(err){
                    return console.error('Error writing to port: ', err.message);
                }
                console.log(`Sent message to turn ${isOn ? 'on' : 'off'} LED at pin ${pinNumber}`);
            });
        }, duration)
    }

    port.on('open', ()=>{
        console.log('Arduino connected');
        setInterval(blink, 1000);
    });

    port.on('error', (err)=>{
        console.error('Error', err);
    });


    return {
        blink
    }
}