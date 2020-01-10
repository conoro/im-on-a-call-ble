// I'm On A Call BLE
// Copyright Conor O'Neill 2019 (conor@conoroneill.com)
// LICENSE: Apache 2.0
// Uses Pixl.js connected to a 32x8 MAX7219 LED Matrix to display scrolling message
//
// MAX7219 Pin connections:
// CLK - D13
// CS - D12
// DIN - D11 (MOSI)
// GND - Ground
// VCC - 5V

// When manufacturerData==0, Button is OFF. When manufacturerData==1, Button is ON.
/*
This is what the Pixl sees coming from the Puck.js switch:

BluetoothDevice: {
  "id": "c5:2e:b9:d5:27:a3",
  "rssi": -50,
  "data": new Uint8Array([2, 1, 6, 4, 255, 144, 5, 0, 20, 9, 73, 109, 32, 79, 110, 32, 65, 32, 67, 97, 108, 108, 32, 83, 119, 105, 116, 99, 104]).buffer,
  "manufacturer": 1424,
  "manufacturerData": new ArrayBuffer(1),
  "name": "Im On A Call Switch"
 }
 
 */

/*
This version allows for multiple switches to be visible to one light.
If *any* switch is on, the light is on.
All switches must be off for light to be off
*/

var disp;
var text;
var x;
var g;
var intervalID;
var currState = 0;
var nextState = 0;

var switchUpdates = [];


function scanForDevices() {
  NRF.findDevices(function (devs) {
    devs.forEach(function (dev) {
      if (dev.name != "Im On A Call Switch") return;
      //   console.log(dev);
      if (!dev.manufacturerData) return;
      var d = new DataView(dev.manufacturerData);
      buttonState = (d.getInt8(0));

      var update = {
        switch: dev.id,
        state: buttonState
      };

      // See if device already seen
      var switchIndex = switchUpdates.findIndex(o => o.switch === dev.id);

      // If not, add device to array
      if (switchIndex === -1) {
        switchIndex = switchUpdates.push(update) - 1;
        //  console.log("Added device " + switchIndex + " to list: " + update.switch);
      } else {
        // Update State
        //  console.log("Updated device " + update.switch + " to: " + update.state);
        switchUpdates[switchIndex].state = buttonState;
      }
    });
  }, 2000); // scan for 2 secs

  // Now do a loop on all entries and see if any are set to 1
  nextState = 0;
  for (var i = 0; i < switchUpdates.length; i++) {
    if (switchUpdates[i].state == 1) nextState = 1;
  }
  // If any set to one, turn on display
  if (currState === 0 && nextState === 1) {
    intervalID = setInterval(scroll, 5);
    currState = 1;
    // If none set to 1, turn off display    
  } else if (currState === 1 && nextState === 0) {
    clearInterval(intervalID);
    currState = 0;
    x = 0;
    g.clear();
    g.flip();
  }
}


function scroll() {
  x--;
  if (x < -g.stringWidth(text)) x = g.getWidth();
  g.clear();
  g.drawString(text, x, 0);
  g.flip();
}

function onInit() {
  require("FontSinclair").add(Graphics);
  SPI1.setup({
    mosi: D11,
    sck: D13
  });
  disp = require("MAX7219").connect(SPI1, D12, 4 /* 4 chained devices */);
  text = "Conor is on a call.";
  x = 0;
  g = Graphics.createArrayBuffer(32, 8, 1);
  currState = 0;
  nextState = 0;
  g.flip = function () {
    disp.raw(g.buffer);
  }; // To send to the display
  setInterval(scanForDevices, 2500); // update every 2.5 seconds
  scanForDevices();
}
