import setup from "./src/sample";
const main = async () => {
    const port = await setup();  
    // const servo = port.servo(8);
    // const servo1 = port.servo(9);
    // const led = port.led(13);
    // const rotateservo = port.Rotateservo(10, 48.75, 4);
    // const rotateservo1 = port.Rotateservo(9, 55.83, 4);
    // await rotateservo.ForwardCM(100);

    // await rotateservo.ForwardM(1);
    // await rotateservo1.ForwardM(1);

    // await Promise.all([
    //     rotateservo.ForwardM(1),
    //     rotateservo1.ForwardM(1)
    // ])

    // console.log('Start')
    // await led.on();
    // led.off()

    
    // await servo1.ReverseRotation(0.5)
    
    // await servo1.ForwardRotation(1);
    // await servo1.lotate(90);
    // await servo1.lotate(180);
    // await servo1.lotate(90);
    // await servo1.lotate(0);
    // const tweheel = port.TwoWheel(55, 4.8, 9,10, 5, 3.3, 4)
    const twewheel = port.TwoWheel(9,10,55,4)
    await twewheel.Forward(10)
    // tweheel.Forward(1)

    
    
}

main();