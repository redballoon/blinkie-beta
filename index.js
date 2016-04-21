var leds = require("rpi-ws2801");


process.on( 'SIGINT', function() {
  console.log( "\nshutting down from (Ctrl-C)" )
  // clear LED stripe and close conection to SPI
  leds.clear(); 
  leds.disconnect();
  process.exit( )
})

leds.connect(160);
leds.clear();
leds.fill(0xFF, 255, 0x00);

setTimeout(function () {
	console.log('timeout');
	leds.setRGB(0, '#FF0000');
	leds.setRGB(159, '#FF0000');
	leds.update();
}, 5000);


setTimeout(function () {
	leds.clear(); 
	leds.disconnect();
}, 10000);