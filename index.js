'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var iconv = require('iconv-lite');

// Constants
var UTF8 = 'utf-8';

module.exports = function (options) {
	options = options || {};

	if (!options.fromEncoding && !options.toEncoding) {
		throw new gutil.PluginError('gulp-convert-encoding', 'At least one of `fromEncoding` or `toEncoding` required');
	}

	options.fromEncoding = options.fromEncoding || UTF8;
	options.toEncoding = options.toEncoding || UTF8;

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			cb();
			return;
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-convert-encoding', 'Streaming not supported'));
			cb();
			return;
		}

		try {
			var content = iconv.decode(new Buffer(file.contents, 'binary'), options.fromEncoding);
        	file.contents = iconv.encode(content, options.toEncoding);
			this.push(file);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-convert-encoding', err));
		}

		cb();
	});
};
