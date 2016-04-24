'use strict';

var through = require('through2');

module.exports = function(options) {
  return through.obj(function(file, enc, cb) {
    var str = file.contents.toString();
    str += 'aaa\n';

    // var err = new Error('foo');
    // err.plugin = 'a';
    // this.emit('error', err);
    // return cb(err);

    file.contents = new Buffer(str);
    this.push(file);
    cb();
  });
};
