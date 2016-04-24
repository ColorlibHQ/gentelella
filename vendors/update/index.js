/*!
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var Base = require('assemble-core');
var expand = require('expand-args');
var minimist = require('minimist');
var config = require('./lib/config');
var locals = require('./lib/locals');
var utils = require('./lib/utils');

/**
 * Create an `update` application. This is the main function exported
 * by the update module.
 *
 * ```js
 * var Update = require('update');
 * var update = new Update();
 * ```
 * @param {Object} `options`
 * @api public
 */

function Update(options) {
  if (!(this instanceof Update)) {
    return new Update(options);
  }
  Base.call(this, options);
  this.name = this.options.name || 'update';
  this.isUpdate = true;
  this.initUpdate(this);
}

/**
 * Inherit assemble-core
 */

Base.extend(Update);

/**
 * Initialize Updater defaults
 */

Update.prototype.initUpdate = function(base) {
  this.set('updaters', {});

  // custom middleware handlers
  this.handler('onStream');
  this.handler('preWrite');
  this.handler('postWrite');

  // parse command line arguments
  var argv = expand(minimist(process.argv.slice(2)), {
    alias: {v: 'verbose'}
  });

  this.option('argv', argv);

  // expose `argv` on the instance
  this.mixin('argv', function(prop) {
    var args = [].slice.call(arguments);
    args.unshift(argv);
    return utils.get.apply(null, args);
  });

  // load the package.json for the updater
  this.data(utils.pkg.sync(this.options.path));
  config(this);

  this.use(locals('update'))
    .use(utils.runtimes({
      displayName: function(key) {
        return base.name === key ? key : (base.name + ':' + key);
      }
    }))
    .use(utils.store())
    .use(utils.pipeline())
    .use(utils.loader())
    .use(utils.cli())
    .use(utils.defaults())
    .use(utils.opts())

  var data = utils.get(this.cache.data, 'update');
  this.config.process(utils.extend({}, data, argv));

  this.engine(['md', 'tmpl'], require('engine-base'));
  this.onLoad(/\.(md|tmpl)$/, function(view, next) {
    utils.matter.parse(view, next);
  });
};

/**
 * Returns a function for resolving filepaths from the given `directory`
 * or from the user's current working directory if no directory
 * is passed.
 *
 * ```js
 * var cwd = update.cwd('foo');
 * var a = cwd('bar');
 * var b = cwd('baz');
 * ```
 * @param {String} `dir`
 * @return {Function}
 */

Update.prototype.cwd = function(dir) {
  var cwd = dir || process.cwd();
  return function() {
    var args = [].slice.call(arguments);
    args.unshift(cwd);
    return path.resolve.apply(null, args);
  };
};

/**
 * Temporary logger method.
 * TODO: add event logger
 */

Update.prototype.log = function() {
  this.emit.bind(this, 'log').apply(this, arguments);
  if (this.enabled('verbose')) {
    console.log.apply(console, arguments);
  }
};

/**
 * Register updater `name` with the given `update`
 * instance.
 *
 * @param {String} `name`
 * @param {Object} `update` Instance of update
 * @return {Object} Returns the instance for chaining
 */

Update.prototype.updater = function(name, app) {
  if (arguments.length === 1 && typeof name === 'string') {
    return this.updaters[name];
  }

  app.use(utils.runtimes({
    displayName: function(key) {
      return app.name === key ? key : (app.name + ':' + key);
    }
  }));

  this.emit('updater', name, app);
  this.updaters[name] = app;
  return app;
};

/**
 * Expose `Update`
 */

module.exports = Update;

/**
 * Expose `utils` and package.json metadata
 */

module.exports.utils = utils;
module.exports.pkg = require('./package');
