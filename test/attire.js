var assert = require('assert');
var expect = require('chai').expect;
var es = require('event-stream');
var File = require('vinyl');
var gutil = require('gulp-util');
var attire = require('../');

describe('gulp-attire', function() {
  describe('in streaming mode', function() {
    it('should merge assets content and outputs a config file', function(done) {
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
              dest: './test/output'
            }
          })
        ])
      });
      // Create a plugin stream
      var myAttire = attire();
      // write the fake file to it
      myAttire.write(fakeFile);
      // wait for the file to come back out
      myAttire.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isStream());
        // buffer the contents to make sure it got prepended to
        file.contents.pipe(es.wait(function(err, data) {
          // check the contents
          var data = JSON.parse(data.toString());
          expect(data).to.have.property('main');
          expect(data).to.have.property('vendor');
          done();
        }));
      });
    });
  });
});
