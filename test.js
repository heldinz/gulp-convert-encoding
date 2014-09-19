'use strict';
var should = require('should');
var assert = require('assert');
var gutil = require('gulp-util');
var iconv = require('iconv-lite');
var convertEncoding = require('./');

var testString = 'äöüß';

it('should throw on empty options', function () {
	(function(){
		var stream = convertEncoding();
	}).should.throw();
});

it('should convert utf8 to latin1', function (cb) {
	var stream = convertEncoding({to: 'iso-8859-15'});

	stream.on('data', function (file) {
		assert.equal(file.relative, 'file.txt');
		assert.equal(iconv.decode(file.contents, 'iso-8859-15'), testString);
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		base: __dirname,
		path: __dirname + '/file.txt',
		contents: new Buffer(testString)
	}));

	stream.end();
});

it('should convert latin1 to utf8', function (cb) {
	var stream = convertEncoding({from: 'iso-8859-15'});

	stream.on('data', function (file) {
		assert.equal(file.relative, 'file.txt');
		assert.equal(iconv.decode(file.contents, 'utf8'), testString);
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		base: __dirname,
		path: __dirname + '/file.txt',
		contents: new Buffer([0xe4, 0xf6, 0xfc, 0xdf])
	}));

	stream.end();
});
