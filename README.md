# [INACTIVE] gulp-attire

**Important notice: This library is deprecated and not actively developed anymore.**

Attire asset pre-compiler task build for gulp.

## Install

```
$ npm install --save-dev gulp-attire
```

## Usage

Manifest:

```json
// theme/foo/config.json
{
  "main.js": [
    "assets/scripts/foo.js"
    "assets/scripts/bar.js"
  ],
  "main.css":"assets/styles/**/*.css",
  "vendor.js": [
    "assets/vendor/bootstrap/dist/js/bootstrap.min.js"
  ]
}
```

Gulp task:

```js
var gulp = require('gulp');
var attire = require('gulp-attire');

gulp.task('attire',function(){
  gulp.src('theme/foo/config.json', { buffer: false })
    .pipe(attire())
    .pipe(gulp.dest('public')); // path to store the manifest file
});
```

Output:

```json
{
  "main.js": "public/js/main-ba96a3de.js",
  "vendor.js": "public/js/vendor-ba96a3de.js",
  "main.css": "public/css/main-ba96a3de.css"
}
```
