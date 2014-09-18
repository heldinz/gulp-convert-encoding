'use strict';
var should = require('should');
var assert = require('assert');
var gutil = require('gulp-util');
var iconv = require('iconv-lite');
var convertEncoding = require('./');

it('should convert utf8 to latin1', function (cb) {
	var stream = convertEncoding({toEncoding: 'iso-8859-15'});

	stream.on('data', function (file) {
		assert.equal(file.relative, 'file.txt');
		assert.equal(iconv.decode(new Buffer(file.contents, 'binary'), 'iso-8859-15'), 'äöüß');
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		base: __dirname,
		path: __dirname + '/file.txt',
		contents: new Buffer('äöüß')
	}));

	stream.end();
});
