var assert = require('assert');
var expect = require('chai').expect;
var es = require('event-stream');
var File = require('vinyl');
var gutil = require('gulp-util');
var attire = require('../');

var fakeFile;

describe('gulp-attire', function() {
  describe('in streaming mode', function() {
    it('should merge assets content and outputs a manifest file', function(done) {
      var fakeFile = new File({
        cwd: 'test',
        base: 'sample',
        path: 'file.json',
        contents: es.readArray([
          JSON.stringify({
            'main.js': [
              'assets/scripts/foo.js',
              'assets/scripts/bar.js'
            ],
            'main.css': 'assets/styles/**/*.css',
            'vendor.js': [
              'assets/vendor/bootstrap/dist/js/bootstrap.min.js'
            ]
          })
        ])
      });
      // Create a plugin stream
      var myAttire = attire({
        dest: 'test/output',
        output: false
      });
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
          expect(data).to.have.property('main.css');
          expect(data).to.have.property('vendor.js');
          expect(data['main.css']).to.include('test/output');
          done();
        }));
      });
    });
  });
});
