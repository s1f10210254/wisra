# wisra
このモジュールを使用すると、シリアル通信を介して、Node.jsからArduino上のfirmataに信号を送り、IOTデバイスを制御することができます。


## Start WISRA
**1,ArduinoのIDEの設定**
```
File > Examples > Firmata > StandardFirmata
```
にアクセスしてコードをArduinoにアップロードします

**install**
```
npm install wisra
```
を行いモジュールのインストールを行います。



## 使用方法

**1,まずライブラリをインポートします。**
```
import setup from "wisra";
```

**2,メイン関数を作成し、サーボモーターやLEDを制御します**
```
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

```

### API
**'setup()'**
Arduino との接続をセットアップします。成功すると、port オブジェクトを返します。 

**'port.servo(pin)'**
指定したピン番号でサーボモーターを制御します。この関数は、lotate メソッドを持つオブジェクトを返します。  

**'port.led(pin)'**
指定したピン番号でLEDを制御します。この関数は、on と off メソッドを持つオブジェクトを返します。  
*`on()`:LEDを点灯します
*`off()`:LEDを消灯します
