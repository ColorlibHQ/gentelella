'use strict';

var through = require('through2');

module.exports = function(options) {
  return through.obj(function(file, enc, cb) {
    var str = file.contents.toString();
    str += 'ddd\n';

    file.contents = new Buffer(str);
    this.push(file);
    cb();
  });
};
