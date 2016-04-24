'use strict';

module.exports = function(app, base, env) {
  return function(cb) {
    env.list(function(err, args) {
      if (err) return cb(err);
      env.run(args, cb);
    });
  };
};
