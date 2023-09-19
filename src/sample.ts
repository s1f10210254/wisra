import { SerialPort } from "serialport";
import { setPinServo } from "./components/servo/setPinServo";
import {setServoSpeed} from "./components/servo/setServoSpeed"
import { findArduinoPath } from "./wisra/findArduinoPath";
import { setServoAngle } from "../src/components/servo/setServoAngle";
import { delay } from "./wisra/delay";
import {setLedState} from "./components/LED/led"
import { resolve } from "path";
type ContinuousServo = {
      ForwardRotation :(speed? :number) => Promise<void>;
      ReverseRotation: (speed? :number) => Promise<void>;
      stop:() => Promise<void>
    }
type StandardServo ={
      rotate:(angle:number) => Promise<void>
    }
const setup = async () => {
    console.log("setup")
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

    

    const servo = (pin: number, type: "continuous" | "standard" = "standard") => {

        return {
            ForwardRotation: async (speed: number = 1) => {
              console.log("ForwardRotation")
              const speed_Forward = 90 + (speed * 90);
              await setPinServo(pin, port);
              await setServoSpeed(pin, speed_Forward, port);
              console.log(`speed ${speed_Forward}`)
            },
            ReverseRotation: async (speed: number = 1) => {
                console.log("ForwardRotation")
                const speed_Rotation = 90 - (speed * 90);
                await setPinServo(pin, port);
                await setServoSpeed(pin, speed_Rotation, port);
                console.log(`speed ${180 - speed_Rotation}`)
            },
            stop: async () => {
                // ここに連続回転サーボを停止させるロジックを書く
                await setPinServo(pin, port);
                await setServoSpeed(pin, 90, port);
                console.log("stop")
            },


            rotate: async (angle: number) => {
              console.log(4)
              await setPinServo(pin, port);
              await setServoAngle(pin, angle, port);
      
              console.log(`Rotating to ${angle} degrees`);
              const DELAY_TIME = 290 +(Math.abs(angle - 90) * 2.5);
              await delay(DELAY_TIME);
            }
        };
    }
    
    const Rotateservo = (pin: number, rpm: number, tireDiameter: number)=>{
      const tireCircumferenceCm = tireDiameter * Math.PI;

      return {
        Forward: async(dinstance: number)=>{
          const distancePerMinute = rpm * tireCircumferenceCm;

          const requiredTime = (dinstance/ distancePerMinute) * 60 * 1000;

          await setPinServo(pin,port);
          await setServoSpeed(pin, 180, port);
          await new Promise(resolve => setTimeout(resolve, requiredTime));
          await setServoSpeed(pin, 90, port)
        }
      }
    }


        
    
  
  
    const led = (pin: number) => {
      return {
        on: async () => {
          await dataReady;
          await setLedState(pin, "on", port);
        },
        off: async () => {
          await dataReady;
          await setLedState(pin, "off", port);
        }
      };
    };

  
  return {
    servo,
    led,
    Rotateservo
  };
}

export default setup;
