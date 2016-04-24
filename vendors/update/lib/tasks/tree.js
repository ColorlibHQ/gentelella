'use strict';

var utils = require('../utils');

module.exports = function(app, base, env) {
  return function(cb) {
    console.log(utils.tree(base.updaters));
    cb();
  };
};
