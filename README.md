# [gulp](http://gulpjs.com)-convert-encoding

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] ![Build Status][ci-image] [![Coveralls Status][coveralls-image]][coveralls-url]

> Convert file encodings using [iconv-lite](https://github.com/ashtuchkin/iconv-lite).

## Install

```sh
npm install --save-dev gulp-convert-encoding
```

## Usage

```js
var gulp = require('gulp');
var convertEncoding = require('gulp-convert-encoding');

gulp.task('default', function () {
	return gulp
		.src('src/file.txt')
		.pipe(convertEncoding({ to: 'iso-8859-15' }))
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

##### iconv

Type: `object`  
Default: `{ decode: {}, encode: {} }`

Allows you to pass additional options into `iconv-lite`, for example [BOM Handling](https://github.com/ashtuchkin/iconv-lite#bom-handling).

<!-- prettier-ignore-start -->
[npm-url]: https://www.npmjs.com/package/gulp-convert-encoding
[npm-image]: https://img.shields.io/npm/v/gulp-convert-encoding.svg?style=flat-square
[downloads-image]: https://img.shields.io/npm/dm/gulp-convert-encoding.svg?style=flat-square

[ci-image]: https://img.shields.io/github/actions/workflow/status/heldinz/gulp-convert-encoding/main.yml?branch=main&style=flat-square

[coveralls-url]: https://coveralls.io/r/heldinz/gulp-convert-encoding?branch=main
[coveralls-image]: https://img.shields.io/coverallsCoverage/github/heldinz/gulp-convert-encoding?branch=main&style=flat-square
<!-- prettier-ignore-end -->
