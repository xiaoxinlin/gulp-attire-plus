module.exports = function(options){

	var gulp 	 	= options.gulp;
	var gutil 	= require('gulp-util');
	var sass 	 	= require('gulp-sass');
	var uglify 	= require('gulp-uglify');
	var path 	 	= require('path');
	var php 	 	= require('gulp-connect-php');
	var browser = require('browser-sync');

	if (options.assetsPath !== null) {
		options.assetsPath = 'assets/';
	}

	if (options.stylesPath !== null) {
		options.stylesPath = 'styles/';
	}

	if (options.scriptsPath!== null) {
		options.scriptsPath = 'scripts/';
	}

	if (options.docRoot !== null) {
		options.docRoot = '.';
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

	gulp.task('attire:reload', browser.reload);

	// Watch Task
	gulp.task('attire:watch', function() {
	  gulp.watch(options.scriptsPath + '/**/*.js', {cwd: options.assetsPath}, ['attire:scripts', 'attire:reload']);
	  gulp.watch(options.stylesPath + '/**/*.+{css|scss|sass}', {cwd: options.assetsPath}, ['attire:styles', 'attire:reload']);
	});

	gulp.task('attire:serve', ['attire:scripts', 'attire:styles'], function() {
	  php.server({ base: options.docRoot, port: 8010, keepalive: true});
	});

	gulp.task('attire:sync', ['attire:serve', 'attire:watch'], function() {
	  browser({
	    proxy: '127.0.0.1:8010',
	    port: 8080,
	    open: true,
	    notify: true
	  });
	});
};
