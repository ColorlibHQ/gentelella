'use strict';

var get = require('get-value');
var set = require('set-value');
var utils = require('./utils');

module.exports = function(name) {
  name = name || utils.project(process.cwd());

  return function(app) {
    app.define('locals', new Locals(name, this));
  };
};

function Locals(name, app) {
  this.cache = get(app, ['cache.data', name]) || {};
}

Locals.prototype.get = function(key) {
  return get(this.cache, key);
};

Locals.prototype.set = function(key, value) {
  set(this.cache, key, value);
  return this;
};
