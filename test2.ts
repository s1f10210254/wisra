import { SerialPort } from "serialport";

const path = 'COM4'
const port = new SerialPort({path, baudRate:57600});

// const servoPin = 9;
// const servoConfing = Buffer.from([0xF0, 0x70, servoPin, 0xF7]);
// port.on("open",()=>{
//     console.log("Arduino connected")

//     port.write(servoConfing, (err)=>{
//         if(err){return console.error("ERROR", err.message)}
//         console.log(`ServoConfig`)
//     })

//     const angle = 90;
//     const servoWrite = Buffer.from([0xE0 | servoPin, angle & 0x7F, (angle >> 7) & 0x7F]);
//     setTimeout(()=>{
//         port.write(servoWrite, (err)=>{
//             if(err){return console.error("ERROR:",err.message)}
//             console.log("angle")
//         })
//     },2000)
// })

port.on('open', function() {
    console.log('Port Opened');
  
    const SERVO_PIN = 9;
  
    // サーボの設定
    const servoConfigCommand = Buffer.from([
      0xF0,  // START_SYSEX
      0x70,  // SYSEX_SERVO_CONFIG
      SERVO_PIN,
      0x00,  // minPulse LSB (544 & 0x7F)
      0x02,  // minPulse MSB (544 >> 7)
      0x70,  // maxPulse LSB (2400 & 0x7F)
      0x09,  // maxPulse MSB (2400 >> 7)
      0xF7   // END_SYSEX
    ]);
  
    port.write(servoConfigCommand, function(err) {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('Servo Config Sent');
  
      // ディレイを追加
      setTimeout(() => {
        // サーボを90度に設定
        const servoWriteCommand = Buffer.from([
          0xE0 | (SERVO_PIN & 0x0F), // Analog message, pin number 0-15
          90 & 0x7F, // LSB
          (90 >> 7) & 0x7F  // MSB
        ]);
  
        port.write(servoWriteCommand, function(err) {
          if (err) {
            return console.log('Error on write: ', err.message);
          }
          console.log('Servo Write 90 degrees Sent');
        });
      }, 2000); // 1000msの遅延
    });
  });
  
  port.on('error', function(err) {
    console.log('Error: ', err.message);
  });