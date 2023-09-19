import { SerialPort } from "serialport";
import { setPinServo } from "./components/servo/setPinServo";
import {setServoSpeed} from "./components/servo/setServoSpeed"
import { findArduinoPath } from "./wisra/findArduinoPath";
import { setServoAngle } from "../src/components/servo/setServoAngle";
import { delay } from "./wisra/delay";
import {setLedState} from "./components/LED/led"
import { resolve } from "path";
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
      //タイヤの円周(cm)
      const tireCircumferenceCm = tireDiameter * Math.PI;

      //タイヤが1分間に進む距離
      const distancePerMinuteCM = rpm * tireCircumferenceCm;
      return {
        ForwardCM: async(dinstance: number)=>{
          
          //指定された距離(cm)を進むための時間を計測(1分)
          const requiredTimeMinutes = (dinstance/ distancePerMinuteCM);

          //1分をミリ秒に変換
          const requiredTimeMilliseconds = requiredTimeMinutes * 60 * 10000

          await setPinServo(pin,port);
          await setServoSpeed(pin, 180, port);
          await new Promise(resolve => setTimeout(resolve, requiredTimeMilliseconds));
          await setServoSpeed(pin, 90, port)
        },
        ForwardM: async(distanceM: number)=>{
          const distanceCM = distanceM * 100;
          
          //指定された距離(cm)を進むための時間を計測(1分)
          const requiredTimeMinutes = (distanceCM/ distancePerMinuteCM);

          //1分をミリ秒に変換
          const requiredTimeMilliseconds = requiredTimeMinutes * 60 * 1000;

          await setPinServo(pin, port);
          await setServoSpeed(pin, 180, port);
          await new Promise(resolve => setTimeout(resolve, requiredTimeMilliseconds));
          await setServoSpeed(pin, 90, port)
        },
        BackwardCM: async(dinstance: number)=>{
          
          //指定された距離(cm)を進むための時間を計測(1分)
          const requiredTimeMinutes = (dinstance/ distancePerMinuteCM);

          //1分をミリ秒に変換
          const requiredTimeMilliseconds = requiredTimeMinutes * 60 * 10000

          await setPinServo(pin,port);
          await setServoSpeed(pin, 0, port);
          await new Promise(resolve => setTimeout(resolve, requiredTimeMilliseconds));
          await setServoSpeed(pin, 90, port)
        },
        BackwardM: async(distanceM: number)=>{
          const distanceCM = distanceM * 100;
          
          //指定された距離(cm)を進むための時間を計測(1分)
          const requiredTimeMinutes = (distanceCM/ distancePerMinuteCM);

          //1分をミリ秒に変換
          const requiredTimeMilliseconds = requiredTimeMinutes * 60 * 1000;

          await setPinServo(pin, port);
          await setServoSpeed(pin, 0, port);
          await new Promise(resolve => setTimeout(resolve, requiredTimeMilliseconds));
          await setServoSpeed(pin, 90, port)
        },
        


        
      }
    }
    const TwoWheel = (pin1: number, pin2:number, rpm: number, tireDiameterCM: number)=>{
      

      //タイヤの円周(cm)
      const tireCircumferenceCm = tireDiameterCM * Math.PI;

      //タイヤが1分間に進む距離
      const distancePerMinuteCM = rpm * tireCircumferenceCm;
      return {
        Forward: async(distanceM: number)=>{
          const distanceCM = distanceM * 100
          //指定された距離(cm)を進むための時間を計測(1分)
          const requiredTimeMinutes = (distanceCM/ distancePerMinuteCM);

          const requiredTimeMilliseconds = requiredTimeMinutes * 60 * 1000;

          Promise.all([
            setPinServo(pin1,port),
            setPinServo(pin2,port)
          ])

          Promise.all([
            setServoSpeed(pin1,0,port),
            setServoSpeed(pin2,0, port)
          ])
          await new Promise(resolve=> setTimeout(resolve, requiredTimeMilliseconds));

          Promise.all([
            setServoSpeed(pin1, 90, port),
            setServoSpeed(pin2, 90, port)
          ])
        }
      }
    }

    // const TwoWheel = (pin1: number, pin2:number, rpm1: number, rpm2: number, tireDiameterCM: number, voltage1:number, voltage2: number)=>{
    //   const tireCircumferenceCm = tireDiameterCM * Math.PI

    //   const getSpeedFromVoltage = (baseVoltage: number, baseRPM: number, targetVoltage: number)=>{
    //     //RPMと電圧の関係は線形
    //     const slope = baseRPM/baseVoltage;
    //     return slope * targetVoltage;
    //   };

    //   const rpmAdjusted1 = getSpeedFromVoltage(5, rpm1, voltage1);
    //   const rpmAdjusted2 = getSpeedFromVoltage(5, rpm2, voltage2);

    //   return {
    //     Forward: async(distanceM: number)=>{
    //       const distancePerMinuteM = (rpmAdjusted1 * tireCircumferenceCm)/ 100; // 分当たりの距離(m)
    //       const requiredTimeMinutes = distanceM / distancePerMinuteM;
    //       const requiredTimeMilliseconds = requiredTimeMinutes * 60 * 1000;

    //       //setServoSpeedの速度調整
    //       const speed1 = 90 + (rpmAdjusted1 / 90) * 90;
    //       const speed2 = 90 + (rpmAdjusted2 / 90) * 90;
    //       Promise.all([
    //         setPinServo(pin1,port),
    //         setPinServo(pin2,port)
    //       ])
    //       Promise.all([
    //         setServoSpeed(pin1, speed1, port),
    //         setServoSpeed(pin2, speed2, port)
    //       ])
          
    //       await new Promise(resolve => setTimeout(resolve, requiredTimeMilliseconds));

    //       Promise.all([
    //         setServoSpeed(pin1, 90, port),
    //         setServoSpeed(pin2, 90, port)
    //       ])
    //     }
    //   }

    // }
//   function calculateRPMAtVoltage(baseRPM: number, baseVoltage: number, givenVoltage: number): number {
//       return baseRPM * (givenVoltage / baseVoltage);
//   }
//   function calculateServoSpeedForRPM(baseRPM:number, targetRPM: number):number {
//     const maxRPM = baseRPM;
//     const minRPM = 0;
//     const maxServoSpeed = 180;
//     const minServoSpeed = 90;

//     const percentageRPM = (targetRPM - minRPM) / (maxRPM - minRPM);
//     return minServoSpeed + (maxServoSpeed - minServoSpeed) * percentageRPM
//   }
  
//   const TwoWheel = (
//     baseRPM: number,                // Motor's RPM at its known voltage
//     baseVoltage: number,            // Motor's known voltage when RPM was measured
//     leftMotorPin: number,           // Pin number for the left motor
//     rightMotorPin: number,          // Pin number for the right motor
//     leftMotorVoltage: number,       // Voltage supplying the left motor
//     rightMotorVoltage: number,      // Voltage supplying the right motor
//     tireDiameterCm: number          // Diameter of the tires in centimeters
//   ) => {
//     const tireCircumference = tireDiameterCm * Math.PI;

//     return {
//         Forward: async(distanceM: number) => {
//             const distanceCm = distanceM * 100;

//             // Calculate RPMs for given voltages
//             const leftRPM = calculateRPMAtVoltage(baseRPM, baseVoltage, leftMotorVoltage);
//             const rightRPM = calculateRPMAtVoltage(baseRPM, baseVoltage, rightMotorVoltage);

//             // Determine the slower RPM (use this as the target RPM for both motors)
//             const minRPM = Math.min(leftRPM, rightRPM);

//             const leftServoSpeed = (leftRPM === minRPM) ? 180 : calculateServoSpeedForRPM(baseRPM,minRPM);
//             const rightServoSpeed = (rightRPM === minRPM) ? 180 : calculateServoSpeedForRPM(baseRPM,minRPM);


//              // Calculate servo speeds for the slower RPM
//             // const servoSpeed1 = calculateServoSpeedForRPM(baseRPM, minRPM);
//             // const servoSpeed2 = calculateServoSpeedForRPM(baseRPM, minRPM);



//             const distancePerMinuteCm = minRPM * tireCircumference;
//             const requiredTimeMinutes = distanceCm / distancePerMinuteCm;
//             const requiredTimeMs = requiredTimeMinutes * 60 * 1000;

            

//             // const servoSpeed = 180; // Assuming 90 is stop, 180 is full speed forward

//             // Initialize servos (assuming you need to do this)
//             await Promise.all([
//                 setPinServo(leftMotorPin, port),
//                 setPinServo(rightMotorPin, port)
//             ]);

//             // Set the speeds for both motors
//             await Promise.all([
//                 setServoSpeed(leftMotorPin, leftServoSpeed, port),
//                 setServoSpeed(rightMotorPin, rightServoSpeed, port)
//             ]);

//             // Wait for the calculated time
//             await new Promise(resolve => setTimeout(resolve, requiredTimeMs));

//             // Stop the motors after traveling the specified distance
//             await Promise.all([
//                 setServoSpeed(leftMotorPin, 90, port),
//                 setServoSpeed(rightMotorPin, 90, port)
//             ]);
//         }
//     };
// }

  
  

        
    
  
  
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
    Rotateservo,
    TwoWheel
  };
}

export default setup;
