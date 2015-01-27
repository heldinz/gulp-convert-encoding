# [gulp](http://gulpjs.com)-convert-encoding [![Build Status](https://travis-ci.org/heldinz/gulp-convert-encoding.svg?branch=master)](https://travis-ci.org/heldinz/gulp-convert-encoding) [![Coverage Status](https://coveralls.io/repos/heldinz/gulp-convert-encoding/badge.svg?branch=master)](https://coveralls.io/r/heldinz/gulp-convert-encoding?branch=master) [![Dependency Status](https://david-dm.org/heldinz/gulp-convert-encoding.svg)](https://david-dm.org/heldinz/gulp-convert-encoding)

> Convert files from one encoding to another using [iconv-lite](https://github.com/ashtuchkin/iconv-lite).


## Install

```sh
$ npm install --save-dev gulp-convert-encoding
```


## Usage

```js
var gulp = require('gulp');
var convertEncoding = require('gulp-convert-encoding');

gulp.task('default', function () {
	return gulp.src('src/file.txt')
		.pipe(convertEncoding({to: 'iso-8859-15'}))
		.pipe(gulp.dest('dist'));
});
```


## API

### convertEncoding(options)

#### options

One or both of the original and/or target file encodings must be specified.

[Supported encodings](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings) are listed on the iconv-lite wiki.

##### from

Type: `string`  
Default: `utf8`

The original file encoding.

##### to

Type: `string`  
Default: `utf8`

The target file encoding.

## License

MIT © [Alice Murphy](https://github.com/heldinz)
