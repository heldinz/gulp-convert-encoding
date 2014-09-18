# [gulp](http://gulpjs.com)-convert-encoding [![Build Status](https://travis-ci.org/alicemurphy/gulp-convert-encoding.svg?branch=master)](https://travis-ci.org/alicemurphy/gulp-convert-encoding)

> Convert files from one encoding to another.


## Install

```sh
$ npm install --save-dev gulp-convert-encoding
```


## Usage

```js
var gulp = require('gulp');
var convertEncoding = require('gulp-convert-encoding');

gulp.task('default', function () {
	return gulp.src('src/file.ext')
		.pipe(convertEncoding({
			fromEncoding: 'iso-8859-15',
			toEncoding: 'utf-8'
		}))
		.pipe(gulp.dest('dist'));
});
```


## API

### convertEncoding(options)

#### options

At least one of the following two options must be specified.

##### fromEncoding

Type: `string`  
Default: `utf-8`

The original file encoding.

##### toEncoding

Type: `string`  
Default: `utf-8`

The target file encoding.

## License

MIT © [Alice Murphy](https://github.com/alicemurphy)
