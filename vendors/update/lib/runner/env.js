'use strict';

var path = require('path');
var define = require('define-property');
var extend = require('extend-shallow');
var get = require('get-value');
var set = require('set-value');

function Env(options) {
  this.options = options || {};
  define(this, 'cache', {});
}

Env.prototype.set = function(key, value) {
  set(this, key, value);
  return this;
};

Env.prototype.get = function(key) {
  return get(this, key);
};

Object.defineProperty(Env.prototype, 'cwd', {
  set: function(dir) {
    this.cache.cwd = dir;
  },
  get: function() {
    return this.cache.cwd || process.cwd();
  }
});

Object.defineProperty(Env.prototype, 'pkg', {
  set: function() {
    throw new Error('env.pkg is a getter and cannot be set directly.');
  },
  get: function() {
    if (!this.cache.pkg) {
      this.cache.pkg = require(path.resolve(this.cwd, 'package.json'));
    }
    return this.cache.pkg;
  }
});

/**
 * Expose `Env`
 */

module.exports = function(options) {
  return function(app) {
    var opts = extend({}, this.options, options);
    app.define('env', new Env(opts));
  };
};
