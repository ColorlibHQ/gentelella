'use strict';

var path = require('path');
var set = require('set-value');
var define = require('define-property');
var use = require('use');

/**
 * Create an instance of `Updater`, optionally passing
 * a default object to initialize with.
 *
 * ```js
 * var app = new Updater({
 *   path: 'foo.html'
 * });
 * ```
 * @param {Object} `app`
 * @api public
 */

function Updater(name, config, fn) {
  if (!(this instanceof Updater)) {
    return new Updater(config);
  }

  if (typeof config === 'function') {
    fn = config;
    config = {};
  }

  this.isUpdater = true;
  define(this, 'cache', {});
  config = config || {};
  config.fn = fn;

  for (var key in config) {
    if (!(key in this)) {
      this.set(key, config[key]);
    }
  }
  use(this);
}

/**
 * Set `key` on the instance with the given `value`.
 *
 * @param {String} `key`
 * @param {Object} `value`
 * @return {Object} Returns the instance for chaining
 */

Updater.prototype.set = function(key, value) {
  set(this, key, value);
  return this;
};

/**
 * Custom `inspect` method.
 */

// Updater.prototype.inspect = function() {
//   var name = this.name || 'Updater';
//   var inspect = [];

//   if (this.alias) {
//     inspect.push('"' + this.alias + '"');
//   }
//   return '<' + name + ' ' + inspect.join(' ') + '>';
// };

/**
 * Get the `cwd` (current working directory) for the updater.
 */

define(Updater.prototype, 'cwd', {
  set: function(dir) {
    this.cache.cwd = dir;
  },
  get: function() {
    return this.cache.cwd || (this.cache.cwd = process.cwd());
  }
});

/**
 * Get the `dirname` for the updater.
 */

define(Updater.prototype, 'dirname', {
  set: function(dir) {
    this.path = path.join(dir, path.basename(this.path));
  },
  get: function() {
    return path.dirname(this.path);
  }
});

/**
 * Get the `basename` for the updater.
 */

define(Updater.prototype, 'basename', {
  set: function(basename) {
    this.path = path.join(path.dirname(this.path), basename);
  },
  get: function() {
    return path.basename(this.path);
  }
});

/**
 * Get the `filename` for the updater.
 */

define(Updater.prototype, 'filename', {
  set: function(filename) {
    this.path = path.join(path.dirname(this.path), filename + this.extname);
  },
  get: function() {
    return path.basename(this.path, this.extname);
  }
});

/**
 * Expose `Updater`
 */

module.exports = Updater;
