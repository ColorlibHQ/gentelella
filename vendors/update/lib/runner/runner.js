'use strict';

var path = require('path');
var Base = require('base');
var option = require('base-options');
var store = require('base-store');
var fns = require('../middleware');
var Updater = require('./updater');
var tasks = require('../tasks');
var utils = require('../utils');
var decorate = require('./decorate');
var listen = require('./listen');
var args = require('./argv');
var list = require('./list');
var run = require('./run');
var Update = require('../..');

module.exports = function(namespace, config) {
  function Runner(argv, options) {
    if (!(this instanceof Runner)) {
      return new Runner(argv, options);
    }

    Base.call(this);
    this.use(option());
    this.use(store());
    this.use(decorate());
    this.use(listen());
    this.use(args());
    this.use(list());
    this.use(run());

    this.options = options || {};
    this.commands = ['set', 'get', 'del', 'store', 'init', 'option', 'data', 'list'];

    this.base = new Update()
      .on('error', console.error)
      .set('argv', argv)

    // register middleware
    for (var fn in fns) {
      fns[fn](this.base, this.base, this);
    }

    // register tasks
    for (var key in tasks) {
      this.base.task(key, tasks[key](this.base, this.base, this));
    }

    this._listen();
  }

  Base.extend(Runner);

  Runner.prototype.updater = function(name) {
    return this.base.updater(name);
  };

  Runner.prototype.build = function() {
    this.base.build.apply(this.base, arguments);
    return this;
  };

  Runner.prototype.register = function(name, options, updater) {
    if (arguments.length === 2) {
      updater = options;
      options = {};
    }

    var Ctor = options.Update || Update;
    var app = new Ctor(this.base.options);
    this.decorate(name, app, options);

    updater.call(app, app, this.base, this);
    this.base.updater(name, app);

    this.emit('register', name, app);
    return this;
  };

  Runner.prototype.registerEach = function(patterns, options) {
    utils.matchFiles(patterns, options).forEach(function(fp) {
      var filepath = path.resolve(fp, 'updatefile.js');
      var updater = require(filepath);

      // get the full project name ('updater-foo')
      var fullname = utils.project(fp);
      // get the updater name ('foo')
      var name = utils.renameFn(fullname, options);
      var opts = {};

      // get the constructor to use (node_modules or our 'Update')
      opts.Update = utils.resolveModule(fp);
      opts.fullname = fullname;
      opts.path = fp;

      this.register(name, opts, updater);
    }.bind(this));
    return this;
  };

  /**
   * Expose `Runner`
   */

  return Runner;
};
