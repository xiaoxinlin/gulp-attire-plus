# gulp-attire

Attire asset pre-compiler task build for gulp.

## Install

```
$ npm install --save-dev gulp-attire
```

## Usage

```js
var gulp = require('gulp');
var attire = require('gulp-attire');

gulp.task('attire',function(){
  gulp.src('./attire.config.json', { buffer: false })
  .pipe(attire())
  .pipe(gulp.dest('./public')); // path to store the output file
});
```

## License

MIT © [David Sosa Valdes](https://github.com/davidsosavaldes)
