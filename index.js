var async = require('async');
var through = require('through2');
var gutil = require('gulp-util');
var crypto = require('crypto');
var path = require('path');
var glob = require("glob");
var fs = require('fs');
var fsPath = require('fs-path');

Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0,0,0,0);
    return d
}

var PluginError = gutil.PluginError;

// consts
const PLUGIN_NAME = 'gulp-attire';
const ALGORITHM = 'aes128';
const HASH = 'd6F3Efeq';
const TIMESTAMP = new Date().getTime().toString();

function encrypt(text){
  var cipher = crypto.createCipher(ALGORITHM, HASH)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(ALGORITHM, HASH)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

function mergeFilesContent(files, cwd){
  output = '';
  async.each(files, function(file){
    var _file = path.resolve(cwd, file);
    var content = fs.readFileSync(_file, 'utf8');
    output += content + '\n';
  }, function(err){
    // if any of the saves produced an error, err would equal that error
  });
  return output;
}

function createOutput(assets, cwd) {
  return new Promise(function(resolve, reject) {
    if (typeof assets == 'string') {
      glob(path.resolve(cwd, assets), {}, function (err, files) {
        if (err) {
          reject(err);
        } else {
          resolve(mergeFilesContent(files, ''));
        }
      });
    }
    else if (assets instanceof Array) {
      resolve(mergeFilesContent(assets, cwd));
    }
    else {
      resolve('');
    }
  });
}

function generator(file, name, source, config) {
  var crypted = encrypt(TIMESTAMP).substring(0,8);
  return new Promise(function(resolve, reject) {
    if (typeof source !== 'undefined') {
      var parsed = {};
      createOutput(source.styles, path.resolve(file.cwd, file.base)).then(function(data) {
        var styleFile = 'styles/' + name + '-' + crypted + '.css';
        var styles = path.resolve(file.cwd, styleFile);
        parsed[name + '.css']  = path.normalize(file.cwd + '/' + styleFile);
        // TODO: minify data?
        if (! config.debug) {
          fsPath.writeFile(styles, data, 'utf8', function(err) {
            if (err) {
              reject(err);
            }
            createOutput(source.scripts, path.resolve(file.cwd, file.base)).then(function(data) {
              var scriptFile = 'scripts/' + name + '-' + crypted +'.js';
              var scripts = path.resolve(file.cwd, scriptFile);
              parsed[name + '.js'] = path.normalize(file.cwd + '/' + scriptFile);
              // TODO: uglify data?
              fsPath.writeFile(scripts, data, 'utf8', function(err) {
                if (err) {
                  reject(err);
                }
                resolve(parsed);
              });
            });
          });
        }
      });
    } else {
      // Src not defined
      resolve();
    }
  });
};

function streamerParser(file, config) {
  var stream = through({objectMode:true}, function(chunk, enc, callback){
    var self    = this;
    var string  = chunk.toString()
    var source  = JSON.parse(string);

    generator(file, 'main', source.main, config).then(function(data){
      var report = typeof data !== 'undefined' ? data : {};
      generator(file, 'vendor', source.vendor, config).then(function(data){
        if (typeof data !== 'undefined'){
          report = Object.assign(report, data);
        }
        self.push(JSON.stringify(report));
        callback();
      }).catch(function(error){
        gutil.log(error);
        // TODO: show current error
        return callback();
      })
    }).catch(function(error){
      gutil.log(error);
      // TODO: show current error
      return callback();
    });
  });
  // stream.write('');
  return stream;
}

// plugin level function (dealing with files)
function gulpAttire(config={}) {
  // creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, callback) {
    if (file.isBuffer()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));
      return cb();
    }

    if (file.isStream()) {
      // define the streamer that will transform the content
      var streamer = streamerParser(file, config);
      // catch errors from the streamer and emit a gulp plugin error
      streamer.on('error', this.emit.bind(this, 'error'));
      var filePath = path.parse(file.path);
      file.path = path.resolve(filePath.dir, 'attire.assets' + filePath.ext);
      // start the transformation
      file.contents = file.contents.pipe(streamer);
    }
    // make sure the file goes through the next gulp plugin
    this.push(file);
    // tell the stream engine that we are done with this file
    callback();
  });

  // returning the file stream
  return stream;
}

// exporting the plugin main function
module.exports = gulpAttire;
