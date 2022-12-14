# IoT-PiggyBank

## Dグループ `null` メンバー
- T4-07 梅原
- T4-24 下山
- T4-34 平川 

## これはなに？ TL;DR
インターネット上でも残高を確認できる貯金箱

## ほしい機能・これは実装したい

### ソフトウェア側
- [**Webアプリ**](https://iot-piggybank.deno.dev/) or スマホアプリ
    - 残高を確認
    - セキュリティを確保したいのでログインとかを実装
    - 遠隔で出金
    - 自動出金
        - 引き出したい金額を指定できる
    - 目標額を設定できる
        - 「ほしいものリスト」から買えるものをお知らせ

### ハードウェア側
- 小銭の種類を自動で判別
- 液晶画面

## 実装が難しそうなもの
- 偽硬貨を弾く
- Alexa対応
- 指紋認証でセキュリティ向上
- 紙幣対応？

## 必要なパーツ
- [Arduino UNO](https://akizukidenshi.com/catalog/g/gM-07385/)
    - Wi-Fiを使う場合
        - [ESP-WROOM-02](https://akizukidenshi.com/catalog/g/gK-09758/)
        - [三端子レギュレータ 3.3V500mA](https://akizukidenshi.com/catalog/g/gI-00432/)
    - ~~LANを使う場合~~
        - ~~[Arduino Ethernet Shield2](https://akizukidenshi.com/catalog/g/gM-14380/)~~
- ~~もしかしたら [Raspberry Pi 4](https://akizukidenshi.com/catalog/g/gM-16834/) を使うかも？~~
- [LCDディスプレイ](https://akizukidenshi.com/catalog/g/gP-00038/) - SC1602BSLB-XA-GB-K
- [半固定抵抗(10kΩ)](https://akizukidenshi.com/catalog/g/gP-08012/)
    - LCDのコントラスト調整用
- [RGB LED](https://akizukidenshi.com/catalog/g/gI-12168/)
- [CdSセル](https://akizukidenshi.com/catalog/g/gI-00110/)
    - 硬貨検出用、日本の小銭は6種類なので6個分
- ~~[フォトリフレクタ](https://akizukidenshi.com/catalog/g/gP-04500/)~~
    - ~~10円玉の検出が上手くいかないので断念~~
- 3Dプリンター
- [AVRマイコン - ATMega328P](https://akizukidenshi.com/catalog/g/gI-03142/)
- 抵抗
    - [100Ω](https://akizukidenshi.com/catalog/g/gR-25101/)
    - [220Ω](https://akizukidenshi.com/catalog/g/gR-25221/)
    - [1kΩ](https://akizukidenshi.com/catalog/g/gR-25102/)
    - [10kΩ](https://akizukidenshi.com/catalog/g/gR-25103/)
- コンデンサ
    - [セラミックコンデンサ 0.1μF](https://akizukidenshi.com/catalog/g/gP-10147/)
    - [電解コンデンサ 100μF](https://akizukidenshi.com/catalog/g/gP-02724/)

## Great Work!
by UMEHARA
