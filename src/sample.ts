import { error } from "console";
import { SerialPort } from "serialport"

let path: string = 'COM3';

export function setup(mypath: string){
    path = mypath;
}

export function LED(pinNumber: number) {
    const port = new SerialPort({path, baudRate: 57600});

    const identifierCode = 0x90;
    let isOn = false;
    let blinkInterval: NodeJS.Timeout | null = null;

    function sendToLED(turnOn: boolean) {
        const bufferValue = turnOn ? (1 << (pinNumber & 0x07)) : 0x00;
        const buffer = Buffer.from([identifierCode + (pinNumber >> 3), bufferValue, 0x00]);
        port.write(buffer, (err) => {
            if(err) return console.error('Error writing to port: ', err.message);
            console.log(`Sent message to turn ${turnOn ? 'on' : 'off'} LED at pin ${pinNumber}`);
        });
    }

    function on(): void {
        if (blinkInterval) clearInterval(blinkInterval);
        sendToLED(true);
    }

    function off(): void {
        if (blinkInterval) clearInterval(blinkInterval);
        sendToLED(false);
    }

    function stop(): void {
        if (blinkInterval) clearInterval(blinkInterval);
    }

    function blink(interval: number = 1000): void {
        setTimeout(() => {
            if (blinkInterval) clearInterval(blinkInterval);
            blinkInterval = setInterval(() => {
                isOn = !isOn;
                sendToLED(isOn);
            }, interval);
        }, 2000);
    }

    port.on('open', () => {
        console.log('Arduino connected');
        blink();
    });

    port.on('error', (err) => {
        console.error('Error', err);
    });

    return {
        on,
        off,
        stop,
        blink
    }
}
