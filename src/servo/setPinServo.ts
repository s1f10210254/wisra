import { SerialPort } from "serialport";

export const setPinServo = (pin: number, port: SerialPort): Promise<void> => {
    return new Promise((resolve, reject) => {
        const PIN_MODE_SERVO = 0x04;
        const PIN = pin;
        const data = [
            0xF4, // Set pin mode command
            PIN,
            PIN_MODE_SERVO // Pin mode
        ];
        port.write(Buffer.from(data), (err) => {
            if (err) {
                reject(err); // Promise is rejected if there's an error
            } else {
                resolve(); // Promise is resolved when write operation is successful
            }
        });
    });
};
