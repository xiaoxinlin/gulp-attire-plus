module.exports = function(options){

	var gulp 	 = options.gulp;
	var gutil  = require('gulp-util');
	var sass 	 = require('gulp-sass');
	var uglify = require('gulp-uglify');
	var path 	 = require('path');

	if (options.assetsPath !== null) {
		options.assetsPath = 'assets/';
	}

	if (options.stylesPath !== null) {
		options.stylesPath = 'styles/';
	}

	if (options.scriptsPath!== null) {
		options.scriptsPath = 'scripts/';
	}

	// Compile/Process Styles
	gulp.task('attire:styles', function() {
	  gulp.src(options.stylesPath + '/**/*.+{css|scss|sass}', {cwd: options.assetsPath})
	    .pipe(sass())
	    .pipe(gulp.dest('public/assets'));
	});

	// Minify Scripts
	gulp.task('attire:scripts', function() {
	  options.gulp.src(options.scriptsPath + '/**/*.js', {cwd: options.assetsPath})
	    .pipe(uglify())
	    .pipe(gulp.dest('public/assets'));
	});

};

//
// gulp.task('reload', browserSync.reload);
//
// // Watch Task
// gulp.task('watch', function() {
//   gulp.watch([app_path + '/**/*.+(php|twig|php.twig)'], ['reload']);
//   gulp.watch([base_path + '/' + scripts + '/**/*.js'], ['scripts', 'reload']);
//   gulp.watch([base_path + '/' + styles + '/**/*.+{css|scss|sass}'], ['styles', 'reload']);
// });
//
// gulp.task('php-serve', ['scripts', 'styles'], function() {
//   php.server({ base: '.', port: 8010, keepalive: true});
// });
//
// gulp.task('browser-sync',['php-serve'], function() {
//   browserSync({
//     proxy: '127.0.0.1:8010',
//     port: 8080,
//     open: true,
//     notify: true
//   });
// });
//
// gulp.task('default', ['browser-sync', 'watch']);
