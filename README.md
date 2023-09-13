# wisra-zu
このモジュールを使用すると、Node.jsを使用してArduino上のIOTデバイスを制御できます

### install
```
npm install s1f10210254/wisra-zu
```

### 使用方法
最初にArduinoのCOMポートをセットアップします。  
デフォルトのCOMポートはCOM3ですが、異なる場合はsetup関数を使用して変更してください。

```
import { setup, LED } from 'your-package-name';

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
