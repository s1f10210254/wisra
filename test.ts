import setup from "./src/sample";
const main = async () => {
    const port = await setup();  
    const servo1 = port.servo(8);
    const servo2 = port.servo(9);
    // const led1 = port.led(13);

    console.log('Start')
    
    // other operations...
    
        // await led1.on()
    await servo1.lotate(0);
    await servo1.lotate(90);
    await servo1.lotate(180);
    await servo1.lotate(90);
    await servo1.lotate(0);
    
}

main();