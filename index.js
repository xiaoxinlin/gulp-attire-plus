var async = require('async');
var through = require('through2');
var gutil = require('gulp-util');
var crypto = require('crypto');
var path = require('path');
var glob = require('glob');
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

function mergeFilesContent(files, cwd=null){
  output = '';
  async.each(files, function(file){
    var content = fs.readFileSync(path.resolve(cwd, file), 'utf8');
    output += content + '\n';
  }, function(err){
    if (err) {
      throw err;
    }
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
          resolve(mergeFilesContent(files));
        }
      });
    }
    else if (assets instanceof Array) {
      resolve(mergeFilesContent(assets, cwd));
    }
    else {
      reject('createOutput: No type allowed');
    }
  });
}

function streamerParser(file, config) {
  var stream = through({objectMode:true}, function(chunk, enc, callback){
    var self   = this;
    var string = chunk.toString()
    var tree   = JSON.parse(string);
    var hash   = encrypt(TIMESTAMP).substring(0,8);

    var assetDir;

    if (file.base !== file.cwd) {
      assetDir = path.resolve(file.cwd, file.base);
    } else {
      assetDir = path.resolve(file.cwd)
    }

    var parsed = {};

    async.forEachOf(tree, function(files, assetFileName, cb){
      createOutput(files, assetDir).then(function(data){
        var assetFile = path.parse(assetFileName);
        var outputName = assetFile.name + '-' + hash + assetFile.ext;
        var outputDir = (config.output)? config.output : 'public';
        parsed[assetFileName] = path.normalize(outputDir + '/' + assetFile.ext.replace('.', '') + '/' + outputName);
        if (! config.debug) {
          fsPath.writeFile(parsed[assetFileName], data, 'utf8', function(err) {
            if (err) {
              gutil.log(err)
              self.emit('error', new PluginError(PLUGIN_NAME, err));
            }
            cb();
          });
        } else {
          cb();
        }
      });
    }, function(err){
      if (err) {
        self.emit('error', new PluginError(PLUGIN_NAME, err));
      }
      self.push(JSON.stringify(parsed));
      callback();
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
