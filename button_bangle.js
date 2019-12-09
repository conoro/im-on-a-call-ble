// I'm On A Call BLE
// Copyright Conor O'Neill 2019 (conor@conoroneill.com)
// LICENSE: Apache 2.0
// Uses Bangle.js to toggle a MAX7219 display connected to an ESP32 also running Espruino
// When BTN1 is pressed, it broadcasts 1 in Advertising Data
// When BTN3 is pressed, it broadcasts 0 in Advertising Data
// Remote Light-devices then scan for the advertising data and either show nothing or scroll a fixed message on MAX7219 LED Matrix

require("Storage").write('+imbusy',{
    name:"I'm Busy",
    icon:"*imbusy",
    src:"-imbusy"
  });
  require("Storage").write('*imbusy',require("heatshrink").decompress(atob("mEwxH+AH4A/AH4A/AH4A/AH4AogAACBhgNJFytW1mBEZEAsYABrkrGLUAh0VFgOB1giHBYMHmNdGIJjZgEcAAMOgEr1iSMrljMS8AiovCjhiBlaSBCpcxMQQuUg4uDGAdWqwgFd4o/BGCpeFGAhgGFANjmQwDmVjmIwSXoYAFg5fIRYNdGAbDBF6MAhAvIMAIeHBAKLEAoqOWAAQvIFQcrBgKRCg4vnYgJgVF5MWg4bLFQMGAgbBQF5JdKC4dclYvVh4uGhwZNSAKPEF6MHLw7ZPDgcxGoYTOF7QcBCqLAHF6gATSA0HF85gGipgoYIwvphxgvSIsHGF8AGBQLBAATCeixhJFYNW1mswIxYgEHeYowHB4LNBgErwOslYwYeYr0CEIYEBiwKCHgMrGDUPGAsch0BFoMIHg0HMQLDYeYwANYoMrebIwSTwrDeMBgvaGAMHMRxecMQsWFpMWhwteGAZjCGQsVg5cfGRAAFFkgA/AH4AsA==")));

  require("Storage").write('-imbusy',`
  function c(a) {
    return {
        width: 8,
        height: a.length,
        bpp: 1,
        buffer: (new Uint8Array(a)).buffer
    };
}

var state = 0;
g.clear();
g.setFont("6x8", 2);
g.setFontAlign(0, 0);
g.drawString("Busy", 180, 40);
g.drawString("Free", 180, 194);
const d = g.getWidth() - 18;
g.drawImage(c([0, 8, 12, 14, 255, 14, 12, 8]), d, 40);
g.drawImage(c([0, 8, 12, 14, 255, 14, 12, 8]), d, 194);
g.setColor(0, 1, 0);
g.fillCircle(120, 120, 50);

NRF.setAdvertising({}, {
    name: "Im On A Call Switch",
    manufacturer: 0x590,
    manufacturerData: [state]
});
setWatch(
    function () {
        state = 1;
        g.setColor(1, 0, 0);
        g.fillCircle(120, 120, 50);
        NRF.setAdvertising({}, {
            name: "Im On A Call Switch",
            manufacturer: 0x590,
            manufacturerData: [state]
        });
    },
    BTN1,
    { edge: "falling", repeat: true, debounce: 50 }
);
setWatch(
    function () {
        state = 0;
        g.setColor(0, 1, 0);
        g.fillCircle(120, 120, 50);
        NRF.setAdvertising({}, {
            name: "Im On A Call Switch",
            manufacturer: 0x590,
            manufacturerData: [state]
        });
    },
    BTN3,
    { edge: "falling", repeat: true, debounce: 50 }
);

`);