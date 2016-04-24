'use strict';

var path = require('path');
var rimraf = require('rimraf');
var through = require('through2');

var mapping = {
  'LICENSE': 'LICENSE-MIT',
  'readme.md': 'README.md'
};

module.exports = function(app, base, env) {
  var config = base.option('rename') || mapping;

  app.task('undo', function() {
    return base.toStream('files')
      .pipe(rename(config, {invert: true}));
  });

  return function() {
    return base.toStream('files')
      .pipe(rename(config));
  };
};

function rename(mapping, options) {
  options = options || {};
  if (options.invert === true) {
    mapping = invert(mapping);
  }
  return through.obj(function(file, enc, next) {
    if (file.isNull()) return next(null, file);
    var fp = file.path;
    function del(err) {
      if (err) return next(err);
      next(null, file);
    }
    for (var key in mapping) {
      if (isMatch(file, mapping[key])) {
        file.path = path.resolve(file.base, key);
        rimraf(fp, del);
        return;
      }
    }
    next(null, file);
  });
}

function isMatch(file, src) {
  file.basename = path.basename(file.path);
  if (src instanceof RegExp) {
    return src.test(file.basename) || src.test(file.path);
  }
  if (typeof src === 'string') {
    return src === file.path || src === file.basename;
  }
}

function invert(obj) {
  var res = {};
  for (var key in obj) {
    res[obj[key]] = key;
  }
  return res;
}
