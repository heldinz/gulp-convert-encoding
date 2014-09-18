# [gulp](http://gulpjs.com)-convert-encoding [![Build Status](https://travis-ci.org/alicemurphy/gulp-convert-encoding.svg?branch=master)](https://travis-ci.org/alicemurphy/gulp-convert-encoding)

> Lorem ipsum


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
		.pipe(convertEncoding())
		.pipe(gulp.dest('dist'));
});
```


## API

### convertEncoding(options)

#### options

##### foo

Type: `boolean`  
Default: `false`

Lorem ipsum.


## License

MIT © [Alice Murphy](https://github.com/alicemurphy)
