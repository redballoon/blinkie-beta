// jshint elision: true, strict:true, curly:false
'use strict';

var path = require('path'),
	fs = require('fs'),
	md5 = require('md5'),
	translate = require('./translate'),
	options = {
		debug : true,
		cache : {
			dir : '/animations',
			externalDir : '/external',
			internalDir : '/internal'
		}
	},
	state = {
		init : false
	};


var methods = {
	log : function () {
		if (!options.debug) return;
		Array.prototype.splice.call(arguments, 0, 0, path.basename(__filename) + ':');
		console.log.apply(null, arguments);
	},
	setAnimation : function () {
	
	},
	write : function (path, data, callback) {
		'strict';
		
		methods.log('write:', path);
		
		fs.writeFile(path, data, function (error) {
			if (error) {
				methods.log('write: failed to cache data.', error);
				if (typeof callback === 'function') callback(false);
				return;
			}
			
			methods.log('write: done.');
			
			callback(data);
		});
	},
	read : function (path, callback) {
		'strict';
		
		methods.log('read:', path);
		
		fs.readFile(path, function (error, data) {
			if (error) {
				methods.log('read: failed to read file.', error);
				if (typeof callback === 'function') callback(false);
				return;
			}
			
			methods.log('read: done.');
			
			callback(data);
		});
	},
	cache : function (url, path, callback) {
		'strict';
		
		methods.log('cache:', url, path);
		
		translate.process(url, function (results) {
			if (!results) {
				methods.log('cache: translation failed.');
				if (typeof callback === 'function') callback(false);
				return;
			}
			
			let json = JSON.stringify({ data : results });
			
			methods.write(path, json, callback);
		});
	},
	/*
	*	load
	*	@param url {string} - a label or url
	*/
	load : function (url, callback) {
		'strict';
		
		methods.log('load:', url);
		
		let filename = '',
			path = '.' + options.cache.dir;
		
		// passing a url
		if (url.indexOf('http') === 0) {
			filename = md5(url) + '.txt';
			path += options.cache.externalDir;
			
		// passing a label
		} else {
			filename = url + '.txt';
			path += options.cache.internalDir;
		}
		
		path += '/' + filename;
		fs.stat(path, function (error, stats) {
			if (error && error.errno !== 34) {
				methods.log('load: unexpected error.', error);
				//if (typeof callback === 'function') callback(false);
				//return;
			}
			
			// file does not exists, translate image
			if (error) {
				methods.log('load: file does not exists.');
				
				methods.cache(url, path, callback);
				
			// file exist, use cached data
			} else {
				methods.read(path, callback);
			}
		});
	},
	init : function () {
		methods.log('init:');
	}
};

module.exports = methods;