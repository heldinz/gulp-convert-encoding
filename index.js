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
	options.iconv = options.iconv ? options.iconv :
		{decode: {}, encode: {}};

	return through.obj(function (file, enc, cb) {

		if (file.isNull()) {
			this.push(file);
			cb();
			return;
		}

		if (file.isStream()) {
			try {
				file.contents = file.contents
					.pipe(iconv.decodeStream(options.from, options.iconv.decode))
					.pipe(iconv.encodeStream(options.to, options.iconv.encode));
				this.push(file);
			} catch (err) {
				this.emit('error', new gutil.PluginError('gulp-convert-encoding', err));
			}
		}

		if (file.isBuffer()) {
			try {
				var content = iconv.decode(file.contents, options.from, options.iconv.decode);
				file.contents = iconv.encode(content, options.to, options.iconv.encode);
				this.push(file);
			} catch (err) {
				this.emit('error', new gutil.PluginError('gulp-convert-encoding', err));
			}
		}

		cb();
	});
};
