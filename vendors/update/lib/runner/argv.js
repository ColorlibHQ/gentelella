'use strict';

var utils = require('../utils');

module.exports = function(options) {
  return function(app) {

    this.define('argv', function(argv, commands, fn) {
      var args = {};
      args.argv = argv;
      args.commands = [];
      args.updaters = {};

      args.flags = utils.expandArgs(utils.omit(argv, ['_', 'files']));
      args.flagskeys = Object.keys(args.flags);

      var files = argv.files ? utils.pick(argv, 'files') : null;
      if (files) args.flags.files = files;

      var arr = argv._;
      var len = arr.length, i = -1;

      while (++i < len) {
        var key = arr[i];

        if (/\W/.test(key)) {
          var obj = utils.expand(key);

          for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
              var val = obj[prop];
              utils.union(args, 'updaters.' + prop, val);
            }
          }
          continue;
        }

        if (utils.contains(commands, key)) {
          args.commands.push(key);
          continue;
        }
        // fn(key, args);
        var updaters = this.base.updaters;
        if (key in updaters) {
          utils.union(args, 'updaters.' + key, 'default');

        } else if (key !== 'base') {
          utils.union(args, 'updaters.base', key);
        }
      }
      return args;
    });
  };
};

