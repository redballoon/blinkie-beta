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
leds.fill(0, 0, 255);

setTimeout(function () {
	console.log('timeout');
	//leds.setRGB(0, '#FF0000');
	//leds.setRGB(0, [255, 0, 0]);
	//leds.setRGB(159, '#FF0000');
	//leds.update();
	
	var index = 1;
	var colors = leds.getRGBArray(255, 0, 0);
	var blank = leds.getRGBArray(0, 0, 0);
	var total = leds.getChannelCount();
	var colorBuffer = new Buffer(total);
	for (var i = 0; i < total; i += 3){
		if (index * 3 === i) {
			colorBuffer[i + 0] = colors[0];
			colorBuffer[i + 1] = colors[1];
			colorBuffer[i + 2] = colors[2];
		} else {
			colorBuffer[i + 0] = blank[0];
			colorBuffer[i + 1] = blank[1];
			colorBuffer[i + 2] = blank[2];
		}
		
	}
	leds.sendRgbBuffer(colorBuffer);
}, 2000);


setTimeout(function () {
	leds.clear(); 
	leds.disconnect();
}, 8000);