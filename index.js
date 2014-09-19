'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var iconv = require('iconv-lite');

// Constants
var UTF8 = 'utf8';

module.exports = function (options) {
	options = options || {};

	if (!options.from && !options.to) {
		throw new gutil.PluginError('gulp-convert-encoding', 'At least one of `from` or `to` required');
	}

	options.from = options.from || UTF8;
	options.to = options.to || UTF8;

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
			var content = iconv.decode(file.contents, options.from);
        	file.contents = iconv.encode(content, options.to);
			this.push(file);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-convert-encoding', err));
		}

		cb();
	});
};
