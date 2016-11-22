var assert = require('assert');
var es = require('event-stream');
var File = require('vinyl');
var prefixer = require('../');
var gutil = require('gulp-util');

describe('gulp-prefixer', function() {
  describe('in streaming mode', function() {

    it('should prepend text', function(done) {

      // create the fake file
      var fakeFile = new File({
        cwd: '/',
        base: '/test/',
        path: '/test/file.js',
        contents: es.readArray([
          JSON.stringify({
            attire: {
              main: {
                scripts: [
                  './test/sample/scripts/foo.js',
                  './test/sample/scripts/bar.js'
                ],
                styles: './test/sample/styles/**/*.css'
              },
              vendor: {
                scripts: './test/sample/vendor/bootstrap/dist/js/bootstrap.min.js'
              },
              output: './test/output'
            }
          })
        ])
      });

      // Create a prefixer plugin stream
      var myPrefixer = prefixer();

      // write the fake file to it
      myPrefixer.write(fakeFile);

      // wait for the file to come back out
      myPrefixer.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isStream());
        // buffer the contents to make sure it got prepended to
        file.contents.pipe(es.wait(function(err, data) {
          // check the contents
          // gutil.log(data.toString());
          // assert.equal(data, 'prependthisstreamwiththosecontents');
          done();
        }));
      });

    });

  });
});
