var leds = require("rpi-ws2801");
var options = {
	debug : true,
	ledTotal : 160,
	chaser : {
		interval : 5,
		timer : null,
		current : 0
	}
};

var methods = {
	animations : {
		chaser : function (color, callback) {
			if (options.debug) console.log('chaser:');
			
			var blank = [0, 0, 0];
			
			leds.clear();
			options.chaser.current = 0;
			options.chaser.timer = setInterval(function () {
				if (options.chaser.current >= options.ledTotal) {
					if (options.debug) console.log('chaser: end of the line.');
					
					clearInterval(options.chaser.timer);
					leds.setColor(options.ledTotal - 1, blank);
					if (typeof callback === 'function') callback();
					return;
				}
				for (var i = 0; i < options.ledTotal; i++){
					if (options.chaser.current === i) {
						leds.setColor(i, color);
					} else {
						leds.setColor(i, blank);
					}
				}
				leds.update();
				// push forward
				options.chaser.current++;
			}, options.chaser.interval);
		}
	},
	init : function () {
		if (options.debug) console.log('init:');
		
		leds.connect(options.ledTotal);
		
		leds.clear();
	}
};

process.on( 'SIGINT', function() {
	// to-do: look for timers and end them
	console.log( "\nshutting down from (Ctrl-C)" )
	// clear LED stripe and close conection to SPI
	leds.clear();
	leds.disconnect();
	process.exit()
})


methods.init();

if (options.debug) console.log('chaser test will start in 3 seconds...');
setTimeout(function () {
	methods.animations.chaser([0, 0, 255], function () {
		if (options.debug) console.log('chaser animation completed.');
		leds.clear(); 
		leds.disconnect();
	});
}, 3000);