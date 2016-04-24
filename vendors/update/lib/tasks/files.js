'use strict';

var path = require('path');

module.exports = function(app, base, env) {
  base.create('files', {
    renameKey: function(key) {
      return path.basename(key);
    }
  });

  var glob = base.get('argv.files');
  if (glob) {
    glob = glob.split(',');
  } else {
    glob = ['*', 'lib/*', 'bin/*'];
  }

  return function(cb) {
    base.files(glob, {dot: true, ignore: ['.DS_Store']});
    base.emit('loaded', base.files);
    cb();
  }
};
