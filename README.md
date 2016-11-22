# gulp-attire

A set of predefined gulp tasks built for the Attire Driver.

## Install

```
$ npm install --save-dev gulp-attire
```

## Usage

```js
var gulp = require('gulp');
var attire = require('gulp-attire');

gulp.src('./attire.config.js')
  .pipe(attire())
  .pipe(gulp.dest('./public'));
```

## License

MIT © [David Sosa Valdes](https://github.com/davidsosavaldes)
