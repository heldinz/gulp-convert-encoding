# [gulp](http://gulpjs.com)-convert-encoding

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] ![Build Status][ci-image] [![Coveralls Status][coveralls-image]][coveralls-url]

Convert character encodings in gulp v4 using [iconv-lite](https://github.com/ashtuchkin/iconv-lite). Supports streams.

> [!NOTE]
> As of gulp v5, this plugin is redundant: gulp v5 includes native support for transcoding text files using iconv-lite.
>
> You can migrate away from this plugin by passing `from` and `to` as `options.encoding` to `src` and `dest` respectively. The default encoding is `utf8`.

## Install

```sh
npm install --save-dev gulp-convert-encoding
```

## Usage

```js
import gulp from 'gulp';
import convertEncoding from 'gulp-convert-encoding';

export default () =>
	gulp
		.src('src/file.txt')
		.pipe(convertEncoding({ from: 'latin1' }))
		.pipe(gulp.dest('dist'));
```

## API

### convertEncoding(options)

> [!IMPORTANT]
> You must provide one or both of the `from` and `to` options.
> [Supported encodings](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings) are listed on the iconv-lite wiki.

#### options

Type: `object`

##### from

Type: `string`  
Default: `utf8`

The current character encoding.

##### to

Type: `string`  
Default: `utf8`

The target character encoding.

##### iconv

Type: `object`  
Default: `{ decode: {}, encode: {} }`

Allows you to pass additional options (e.g. for [BOM Handling](https://github.com/ashtuchkin/iconv-lite#bom-handling)) into `iconv-lite`.

<!-- prettier-ignore-start -->
[npm-url]: https://www.npmjs.com/package/gulp-convert-encoding
[npm-image]: https://img.shields.io/npm/v/gulp-convert-encoding.svg?style=flat-square
[downloads-image]: https://img.shields.io/npm/dm/gulp-convert-encoding.svg?style=flat-square

[ci-image]: https://img.shields.io/github/actions/workflow/status/heldinz/gulp-convert-encoding/main.yml?branch=main&style=flat-square

[coveralls-url]: https://coveralls.io/r/heldinz/gulp-convert-encoding?branch=main
[coveralls-image]: https://img.shields.io/coverallsCoverage/github/heldinz/gulp-convert-encoding?branch=main&style=flat-square
<!-- prettier-ignore-end -->
