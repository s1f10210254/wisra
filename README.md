LED Controller for Arduino
This npm package provides a simple interface to control an LED connected to an Arduino. With just a few lines of code, you can make the LED blink.

Installation
bash
Copy code
npm install @s1f10210254/wisra-zu
Usage
Here's a basic example:

typescript
Copy code
import { LED } from '@s1f10210254/wisra-zu';

const led = LED(13);
led.blink();
In the above code, the LED connected to pin 13 of the Arduino will start blinking.

Configuration
By default, the package connects to the Arduino via the COM4 port. Make sure to modify the port settings according to your system's configuration.

API
LED(pin: number): LEDInstance
Creates an instance of the LED controller for the given pin.

Arguments:

pin (number): The Arduino pin where the LED is connected.
Returns:

An LEDInstance with methods to control the LED.
LEDInstance.blink()
Makes the LED blink at a 1-second interval.

Troubleshooting
If you encounter any issues:

Ensure your Arduino is connected and the correct port is set in the code.
Check your Arduino's baud rate. The default is set to 57600.
Ensure the LED is properly connected to the specified pin.
Contributing
Feel free to open issues or submit pull requests if you have improvements or fixes.