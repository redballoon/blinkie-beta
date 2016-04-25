// jshint elision: true, strict:true, curly:false
'use strict';

var path = require('path');
var manager = require('./manager');
var options = {
	debug : true
};

var methods = {
	log : function () {
		if (!options.debug) return;
		Array.prototype.splice.call(arguments, 0, 0, path.basename(__filename) + ':');
		console.log.apply(null, arguments);
	},
	init : function () {
		methods.log('init:');
		
		manager.load('http://undergroundfarm.com/work.sandbox/blinkie/chaser-red.gif', function (data) {
			methods.log('init: load complete');
			
			methods.log('init: data:', data);
		});
	}
};

methods.init();