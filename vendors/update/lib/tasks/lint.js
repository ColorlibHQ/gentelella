'use strict';

var through = require('through2');
var eslint = require('gulp-eslint');

module.exports = function(app, base, env) {
  return function() {
    return base.toStream('files')
      .pipe(through.obj(function(file, enc, cb) {
        if (/\.js$/.test(file.path)) {
          this.push(file);
        }
        cb();
      }))
      .pipe(eslint())
      .pipe(eslint.format())
  };
};
