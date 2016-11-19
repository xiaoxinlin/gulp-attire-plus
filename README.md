# gulp-attire [![Build Status](https://travis-ci.org/davidsosavaldes/gulp-attire.svg?branch=master)](https://travis-ci.org/davidsosavaldes/gulp-attire)

> My kryptonian gulp plugin


## Install

```
$ npm install --save-dev gulp-attire
```


## Usage

```js
const gulp = require('gulp');
const attire = require('gulp-attire');

gulp.task('default', () => {
	gulp.src('src/file.ext')
		.pipe(attire())
		.pipe(gulp.dest('dist'))
);
```


## API

### attire([options])

#### options

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.


## License

MIT © [David Sosa Valdes](https://github.com/davidsosavaldes)
