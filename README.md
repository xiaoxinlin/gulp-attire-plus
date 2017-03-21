# gulp-attire-plus

gulp的资源预编译插件，可以对资源进行合并，添加文件hash

## 安装

```
$ npm install --save-dev gulp-attire-plus
```

## 用法

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

Gulp 任务:

```js
var gulp = require('gulp');
var attire = require('gulp-attire-plus');

gulp.task('attire',function(){
  gulp.src('theme/foo/config.json', { buffer: false })
    .pipe(attire())
    .pipe(gulp.dest('public')); // path to store the manifest file
});
```

输出:

```json
{
  "main.js": "public/js/main-ba96a3de.js",
  "vendor.js": "public/js/vendor-ba96a3de.js",
  "main.css": "public/css/main-ba96a3de.css"
}
```

## API

### attire(options)

#### dest
类型：`String`

指定资源文件生成目录，默认值为public，该属性在`output`为`true`时有效

#### output
类型：`Boolean`

设置是否输出资源文件，默认值为true

#### hex
类型：`String`

设置文件版本号中hash编码的内容：默认值为`time`

*可选选项**

`time` -- 以当前时间戳进行hash编码

`content` -- 以文件内容进行hash编码

#### sep
类型：`String`

设置文件名与文件版本号之间的分隔符，默认为`-`



