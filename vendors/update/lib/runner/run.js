'use strict';

var utils = require('../utils');

module.exports = function(options) {
  return function(app) {

    this.define('getApp', function(name) {
      return name !== 'base'
        ? this.base.updater(name)
        : this.base;
    });

    this.define('run', function(args, cb) {
      if (typeof args === 'function') {
        cb = args;
        args = null;
      }

      if (!args) {
        var commands = this.options.commands || this.commands;
        args = this.argv(this.base.get('argv'), commands);
      }

      if (args.commands && args.commands.length > 1) {
        var cmd = '"' + args.commands.join(', ') + '"';
        return cb(new Error('Error: only one root level command may be given: ' + cmd));
      }

      this.base.cli.process(args.flags);
      var self = this;

      utils.async.eachOf(args.updaters, function(tasks, name, next) {
        var app = self.getApp(name);

        tasks = tasks.filter(Boolean);
        if (!tasks.length) return next();

        self.emit('task', name, tasks);
        app.build(tasks, next);
      }, cb);

      return this;
    });
  };
};
