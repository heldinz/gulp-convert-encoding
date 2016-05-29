'use strict';
var should = require('should');
var assert = require('assert');
var gutil = require('gulp-util');
var iconv = require('iconv-lite');
var es = require('event-stream');
var convertEncoding = require('./');

var testString = 'äöüß';

var UTF8 = 'utf8';
var LATIN1 = 'iso-8859-15';

describe('gulp-convert-encoding', function() {

	it('should throw on empty options', function () {
		(function(){
			var stream = convertEncoding();
		}).should.throw();
	});

	it('should throw on binary file', function () {
		(function(){
			var stream = convertEncoding({to: LATIN1});

			stream.write(new gutil.File({
				base: path.join(__dirname, './fixtures/'),
				cwd: __dirname,
				path: path.join(__dirname + './fixtures/1x1.png')
			}))
		}).should.throw();
	});

	it('should ignore null files', function(cb) {
		var stream = convertEncoding({to: LATIN1}),
			  n = 0;

		stream.on('data', function(file) {
			assert.equal(file.contents, null);
			n++;
			assert.equal(n, 1);
		});

		stream.on('end', function() {
			cb();
		});

		stream.write(new gutil.File({
			base: __dirname,
			path: __dirname + '/file.txt',
			contents: null
		}));

		stream.end();
	});

	describe('in buffer mode', function() {
		it('should convert from utf8 to latin1', function (cb) {
			var stream = convertEncoding({to: LATIN1});

			stream.on('data', function (file) {
				assert(file.isBuffer());
				assert.equal(file.relative, 'file.txt');
				assert.equal(iconv.decode(file.contents, LATIN1), testString);
			});

			stream.on('end', cb);

			stream.write(new gutil.File({
				base: __dirname,
				path: __dirname + '/file.txt',
				contents: new Buffer(testString)
			}));

			stream.end();
		});

		it('should convert from latin1 to utf8', function (cb) {
			var stream = convertEncoding({from: LATIN1});

			stream.on('data', function (file) {
				assert(file.isBuffer());
				assert.equal(file.relative, 'file.txt');
				assert.equal(iconv.decode(file.contents, UTF8), testString);
			});

			stream.on('end', cb);

			stream.write(new gutil.File({
				base: __dirname,
				path: __dirname + '/file.txt',
				contents: new Buffer([0xe4, 0xf6, 0xfc, 0xdf])
			}));

			stream.end();
		});
	});

	describe('in streaming mode', function() {
		it('should convert from utf8 to latin1', function (cb) {
			var stream = convertEncoding({to: LATIN1});

			stream.on('data', function(file) {
				assert(file.isStream());
				assert.equal(file.relative, 'file.txt');

				// buffer the contents
				file.contents.pipe(es.wait(function(err, data) {
					assert.equal(iconv.decode(new Buffer(data), LATIN1), testString);
				}));
			});

			stream.on('end', cb);

			stream.write(new gutil.File({
				base: __dirname,
				path: __dirname + '/file.txt',
				contents: es.readArray([testString])
			}));

			stream.end();
		});

		it('should convert from latin1 to utf8', function (cb) {
			var stream = convertEncoding({from: LATIN1});

			stream.on('data', function(file) {
				assert(file.isStream());
				assert.equal(file.relative, 'file.txt');

				// buffer the contents
				file.contents.pipe(es.wait(function(err, data) {
					assert.equal(iconv.decode(new Buffer(data), UTF8), testString);
				}));
			});

			stream.on('end', cb);

			stream.write(new gutil.File({
				base: __dirname,
				path: __dirname + '/file.txt',
				contents: es.readArray([new Buffer([0xe4, 0xf6, 0xfc, 0xdf])])
			}));

			stream.end();
		});

	});
});
