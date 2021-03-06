// jshint elision: true, strict:true, curly:false
'use strict';

var path = require('path');
var getPixels = require('get-pixels');

var options = {
	debug : true,
	ledTotal : 160,
	imagePath : 'assets/chaser-red.gif'
};

var methods = {
	log : function () {
		if (!options.debug) return;
		
		Array.prototype.splice.call(arguments, 0, 0, path.basename(__filename) + ':');
		console.log.apply(null, arguments);
	},
	handlePixels : function (pixels, callback) {
		'use strict';
		
		methods.log('handlePixels:');
		
		methods.log('handlePixels: frames:', pixels.shape[0]);
		methods.log('handlePixels: width:', pixels.shape[1]);
		methods.log('handlePixels: height:', pixels.shape[2]);
		
		var results = [];
		// frames
		for (var i = 0; i < pixels.shape[0]; i++) {
			var frame = [];
			
			// width
			for (var j = 0; j < pixels.shape[1]; j++) {
				// height
				for (var k = 0; k < pixels.shape[2]; k++) {
					var color = [];
					for (var l = 0; l < pixels.shape[3] - 1; l++) {
						color.push(pixels.get(i, j, k, l));
					}
					
					frame.push(color);
					
					// blank
					// if (color[0] + color[1] + color[2] === 0) {
// 						frame.push(color);
// 					} else {
						// probably check for brightness ?
// 						frame.push(color);
// 					}
					//if (options.debug) console.log('handlePixels: rgba:', r + ',' + g + ',' + b + ',' + a);
				}
			}
			results.push(frame);
		}
		
		if (typeof callback === 'function') callback(results);
	},
	/**
	*	process
	*	for now, will only use paths
	*/
	process : function (path, callback) {
		methods.log('process:', path);
		
		getPixels(path, function (error, pixels) {
			if (error) {
				methods.log('process: an error occurred.', error);
				if (typeof callback === 'function') callback(false);
			}
			
			methods.handlePixels(pixels, callback);
		});
	}
};

module.exports = {
	process : methods.process
};