# I'm on a Call BLE Edition

Copyright Conor O'Neill 2019 (conor@conoroneill.com)

LICENSE: Apache 2.0

* An Espruino [Puck.js](http://www.espruino.com/Puck.js) with red Neopixel and silicone lid is used to create a BLE button which lights up when you press the lid. This sits on my desk and I press it when I'm starting a phone/video call.

![BLE Button](/im_on_a_call_ble.jpg)

* When button/led is set on, it broadcasts 1 in BLE ManufacturerData
* When button/led is set off, it broadcasts 0 in BLE ManufacturerData
* A matching device on my home office door (either a [Pixl.js](http://www.espruino.com/Pixl.js) or ESP32 running [Espruino](https://espruino.com)) scans for those messages. 
* When it sees that the button is on, it scrolls a message on an attached MAX7219 LED Matrix display
* My kids then know not to come barging in :-)

* A variation using a [Bangle.js](https://banglejs.com) is also included and is in the video

[![Bangle.js I'm On A Call](https://img.youtube.com/vi/ozK7g2NfCEI/0.jpg)](https://www.youtube.com/watch?v=ozK7g2NfCEI)


[Phone icon](https://icons8.com/icons/set/phone) by [Icons8](https://icons8.com) 

