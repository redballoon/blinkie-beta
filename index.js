var path = require('path');
var leds = require('rpi-ws2801');
var translate = require('translate.js');
var options = {
	debug : true,
	ledTotal : 160,
	ticker : {
		timer : null,
		interval : 5
	},
	chaser : {
		interval : 5,
		timer : null,
		current : 0
	}
};

var methods = {
	log : function () {
		if (!options.debug) return;
		Array.prototype.splice.call(arguments, 0, 0, path.basename(__filename) + ':');
		console.log.apply(null, arguments);
	},
	close : function () {
		leds.clear();
		leds.disconnect();
	},
	animations : {
		chaser : function (data, callback) {
			'strict';
			
			methods.log('chaser:');
			
			for (let i = 0; i < data.length; i++){
				leds.setColor(i, data[i]);
			}
			
			leds.update();
		}
	},
	fromImage : function (path, callback) {
		'strict';
		
		methods.log('fromImage:', path);
		
		translate.process(path, function (results) {
			
			if (!results) {
				methods.log('fromImage: error.');
				methods.close();
				return false;
			}
			
			leds.clear();
			
			options.ticker.timer = setInterval(function () {
				if (!results.length) {
					methods.log('fromImage: end of the line.');
					
					clearInterval(options.ticker.timer);
					if (typeof callback === 'function') callback();
					return;
				}
				
				let row = results.shift();
				methods.animations.chaser(row);
				
			}, options.ticker.interval);
			
		});
	},
	init : function () {
		methods.log('init:');
		
		leds.connect(options.ledTotal);
		
		leds.clear();
	}
};

process.on( 'SIGINT', function() {
	// to-do: look for timers and end them
	console.log( "\nshutting down from (Ctrl-C)" );
	// clear LED stripe and close conection to SPI
	methods.close();
	process.exit();
});


methods.init();

methods.log('chaser test will start in 3 seconds...');
setTimeout(function () {
	/*
	methods.animations.chaser([0, 0, 255], function () {
		methods.log('chaser animation completed.');
		leds.clear(); 
		leds.disconnect();
	});
	*/
	methods.fromImage('./assets/chaser-red.gif', function () {
		methods.close();
	});
}, 5000);