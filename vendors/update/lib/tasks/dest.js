'use strict';

var utils = require('../utils');

module.exports = function(app, base, env) {
  var plugins = base.get('argv.plugins');

  function handle(stage) {
    return utils.through.obj(function(file, enc, next) {
      if (file.isNull()) return next();
      app.handle(stage, file, next);
    });
  }

  return function(cb) {
    app.toStream('files')
      .on('error', cb)
      .pipe(handle('onStream'))
      .on('error', cb)
      .pipe(app.pipeline(plugins))
      .on('error', cb)
      .pipe(handle('preWrite'))
      .on('error', cb)
      .pipe(app.dest('.'))
      .pipe(utils.exhaust(handle('postWrite')))
      .on('error', cb)
      .on('end', cb);
  };
};
