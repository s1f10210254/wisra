# wisra-zu
このモジュールを使用すると、シリアル通信を介して、Node.jsからArduino上のfirmataに信号を送り、IOTデバイスを制御することができます。


### 使用方法
1,ArduinoのIDEから
```
File > Examples > Firmata > StandardFirmata
```
にアクセスしてコードをArduinoにアップロードします

2,node.jsの設定
```
npm install serialport
npm install wisra-zu
```
を行いモジュールのインストールを行います。



### 最初にArduinoのCOMポートをセットアップします。  デフォルトのCOMポートはCOM3ですが、異なる場合はsetup関数を使用して変更してください。

```
import { setup, LED } from 'wisra-zu';

// COMポートをセットアップする
setup('COM4');  // 例: COM4に変更する場合
```

### LEDを制御する  

**LED を制御するためのインスタンスの作成**
```
const led = LED(13);  // ピン13を制御するインスタンスの作成
```

**LEDをオンにする**
```
led.on();
```

**LEDをオフにする**
```
led.off();
```

**LEDを点滅させる**
```
led.blink(); // デフォルトの1秒間隔で点滅します。
led.blink(2000); // 2秒間隔で点滅します。
```


**注意** 'on'や'blink'メソッドを使用すると、エンターキーを押すまでLEDの制御が継続されます。
