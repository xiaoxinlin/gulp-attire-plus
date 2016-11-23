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

gulp.task('attire',function(){
  gulp.src('./attire.config.json', { buffer: false })
  .pipe(attire())
  .pipe(gulp.dest('./public')); // path to store the output file
});
```

## API

### attire([options])

#### options

##### gulp

Type: `object`<br>

Gulp instance.

## License

MIT © [David Sosa Valdes](https://github.com/davidsosavaldes)
