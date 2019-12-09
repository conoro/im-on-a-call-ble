// I'm On A Call BLE
// Copyright Conor O'Neill 2019 (conor@conoroneill.com)
// LICENSE: Apache 2.0
// Uses ESP32 connected to a 32x8 MAX7219 LED Matrix to display scrolling message
//
// MAX7219 Pin connections:
// CLK - D18 (SCK)
// CS - D5
// DIN - D23 (MOSI)
// GND - Ground
// VCC - 5V

// When manufacturerData==0, Button is OFF. When manufacturerData==1, Button is ON.
/*
This is what the ESP32 sees coming from the Puck.js switch:

BluetoothDevice: {
  "id": "c5:2e:b9:d5:27:a3",
  "rssi": -50,
  "data": new Uint8Array([2, 1, 6, 4, 255, 144, 5, 0, 20, 9, 73, 109, 32, 79, 110, 32, 65, 32, 67, 97, 108, 108, 32, 83, 119, 105, 116, 99, 104]).buffer,
  "manufacturer": 1424,
  "manufacturerData": new ArrayBuffer(1),
  "name": "Im On A Call Switch"
 }
 
 */

var disp;
var text;
var x;
var g;
var intervalID;
var currState;
var nextState;


function scanForDevices() {
    NRF.findDevices(function(devs) {
      var idx = 0;
      devs.forEach(function(dev) {
        if (dev.name!="Im On A Call Switch") return;
     //   console.log(dev);
        if (!dev.manufacturerData) return;
        var d = new DataView(dev.manufacturerData);
        nextState = (d.getInt8(0));
        idx++;
        if (currState === 0 && nextState === 1){
            intervalID = setInterval(scroll, 5);
            currState = 1;
        } else if (currState === 1 && nextState === 0){
            clearInterval(intervalID);
            currState = 0;
            x=0;
            g.clear();
            g.flip();
        }
      });
    //  if (!idx) console.log("(no devices found)");
    }, 1000); // scan for 1 secs
  }
  
 
function scroll() {x--;
  if (x<-g.stringWidth(text)) x=g.getWidth();
  g.clear();
  g.drawString(text, x, 0);
  g.flip();
}

function onInit() {
  require("FontSinclair").add(Graphics);
  SPI1.setup({mosi:D23, sck:D18});
  disp = require("MAX7219").connect(SPI1, D5, 4 /* 4 chained devices */);
  text = "Conor is on a call.";
  x = 0;
  g = Graphics.createArrayBuffer(32, 8, 1);
  currState=0;
  nextState=0;
  g.flip = function() { disp.raw(g.buffer); }; // To send to the display
  setInterval(scanForDevices, 2000); // update every 2 seconds
  scanForDevices();  
}


