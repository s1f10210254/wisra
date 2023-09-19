import setup from "./src/index";
const main = async () => {
    const port = await setup();  
    const servo = port.servo(8);
    const servo1 = port.servo(9);
    const led = port.led(13);

    console.log('Start')
    await led.on();

    
    
    
    
    await servo1.lotate(0);
    await servo1.lotate(90);
    await servo1.lotate(180);
    await servo1.lotate(90);
    await servo1.lotate(0);
    
}

main();