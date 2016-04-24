'use strict';

module.exports = function(app, base, env) {
  return function(cb) {
    return cb();
  };
};
