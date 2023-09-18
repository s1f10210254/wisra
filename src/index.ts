import { SerialPort } from "serialport";
import { setPinServo } from "./components/servo/setPinServo";
import { findArduinoPath } from "./wisra/findArduinoPath";
import { setServoAngle } from "../src/components/servo/setServoAngle";
import { delay } from "./wisra/delay";
import {setLedState} from "./components/LED/led"

const setup = async () => {
    console.log(1)
    const path = await findArduinoPath()
    if (!path){throw new Error("Arduino path not found!")}
    const port = new SerialPort({ path, baudRate: 57600 });
    
    let onDataReady: (() => void) | null = null;
    const dataReady = new Promise<void>(resolve => {
        console.log(3)
      onDataReady = resolve;
    });

    port.on('data', (data) => {
        console.log('Data:', data)
        if (onDataReady) {
           onDataReady();
         }
        })

        await dataReady

  const servo = (pin: number) => {
    return {
      lotate: async (angle: number) => {
        console.log(4)
        await setPinServo(pin, port);
        await setServoAngle(pin, angle, port);

        console.log(`Rotating to ${angle} degrees`);
        const DELAY_TIME = 290 +(Math.abs(angle - 90) * 2.5);
        await delay(DELAY_TIME);
      }
    };
  };
  
  const led = (pin: number) => {
    return {
      on: async () => {
        await dataReady;
        await setLedState(pin, "on", port);
      },
      off: async () => {
        await dataReady;
        await setLedState(pin, "off", port);
      },
    //   blink: async()=>{
    //     await dataReady;
    //     await setLedState(pin, "blink", port)
    //   }
    };
  };
  
  return {
    servo,
    led,
  };
}

export default setup;
