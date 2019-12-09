// I'm On A Call BLE
// Copyright Conor O'Neill 2019 (conor@conoroneill.com)
// LICENSE: Apache 2.0
// Uses Puck.js with Neopixel and silicons lid to create button which lights up when you press the lid
// When button/led is set on, it broadcasts 1 in Advertising Data
// When button/led is set off, it broadcasts 0 in Advertising Data
// Light devices then scan for the advertising data and either show nothing or scroll a fixed message on MAX7219 LED Matrix

function onInit() {
    var state = 0;
    LED1.write(state);
    NRF.setAdvertising({},{
        name: "Im On A Call Switch",
        manufacturer: 0x590,
        manufacturerData: [state]
    });
    require("neopixel").write(D29, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    setWatch(
      function() {
        if (state === 0) {
          state = 1;
          require("neopixel").write(D29, [0, 255, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0]);
        } else {
          state = 0;
          require("neopixel").write(D29, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
        LED1.write(state);
        NRF.setAdvertising({},{
            name: "Im On A Call Switch",
            manufacturer: 0x590,
            manufacturerData: [state]
        });
      },
      BTN,
      { edge: "rising", repeat: true, debounce: 50 }
    );
  }

  