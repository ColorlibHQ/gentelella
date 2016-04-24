'use strict';

var fs = require('fs');
var path = require('path');
var pkg = require(path.resolve(__dirname, '../package'));

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

require('assemble-loader', 'loader');
require('async');
require('base-cli', 'cli');
require('base-pipeline', 'pipeline');
require('base-store', 'store');
require('composer-runtimes', 'runtimes');
require('expand-args');
require('expand-object', 'expand');
require('extend-shallow', 'extend');
require('for-own');
require('get-value', 'get');
require('load-pkg', 'pkg');
require('matched', 'glob');
require('micromatch', 'mm');
require('object.omit', 'omit');
require('object.pick', 'pick');
require('parser-front-matter', 'matter');
require('project-name', 'project');
require('question-cache', 'questions');
require('set-value', 'set');
require('stream-exhaust', 'exhaust');
require('through2', 'through');
require('union-value', 'union');

require('success-symbol');
require('ansi-yellow', 'yellow');
require('ansi-green', 'green');
require('ansi-gray', 'gray');
require('ansi-cyan', 'cyan');
require('ansi-red', 'red');
require('time-stamp', 'stamp');
require = fn;

/**
 * Logging utils
 */

utils.timestamp = function(msg) {
  var time = '[' + utils.gray(utils.stamp('HH:mm:ss', new Date())) + ']';
  return console.log(time, msg);
};

function Status(status) {
  status = status || {};
  this.err = status.err || null;
  this.code = status.code || null;
  this.name = status.name || '';
  this.msg = status.msg || '';
}

utils.ok = function() {
  var args = utils.toArray(arguments) || [];
  args.unshift(' ' + utils.green(utils.successSymbol));
  console.log.apply(console, args);
};
utils.success = function() {
  var args = utils.toArray(arguments) || [];
  args[0] = utils.green(args[0] || '');
  console.log.apply(console, args);
};
utils.error = function() {
  var args = utils.toArray(arguments);
  args.unshift(utils.red('Error:'));
  console.error.apply(console, args);
};

/**
 * CLI utils
 */

utils.commands = function(argv) {
  argv._ = argv._ || [];
  var commands = {};

  argv._.forEach(function(key) {
    commands[key] = true;
  });
  return commands;
};

utils.identity = function(val) {
  return val;
};

utils.arrayify = function(val) {
  return Array.isArray(val) ? val : [val];
};

utils.toArgv = function(args) {
  var argv = args.flags;
  argv._ = args.commands;
  return argv;
};

utils.toArray = function(val) {
  if (Array.isArray(val)) return val;
  if (val && val.length) {
    return [].slice.call(val);
  }
};

utils.contains = function(arr, key) {
  return arr.indexOf(key) > -1;
};

utils.npm = function(name) {
  return utils.tryRequire(name) || utils.tryRequire(path.resolve(name));
};

utils.exists = function(fp) {
  return fs.existsSync(fp);
};

/**
 * Rename a filepath to the "nickname" of the project.
 *
 * ```js
 * renameFn('updater-foo');
 * //=> 'foo'
 * ```
 */

utils.renameFn = function(filename, options) {
  if (options && typeof options.renameFn === 'function') {
    return options.renameFn(filename);
  }
  return filename.slice(filename.indexOf('-') + 1);
};

/**
 * Return a glob of file paths
 */

utils.matchFiles = function(pattern, options) {
  options = options || {};
  var isMatch = utils.mm.matcher(pattern);
  var files = fs.readdirSync(options.cwd);
  var len = files.length, i = -1;
  var res = [];
  while (++i < len) {
    var name = files[i];
    if (name === 'update') continue;
    var fp = path.join(options.cwd, name);
    if (isMatch(fp) || isMatch(name)) {
      res.push(fp);
    }
  }
  return res;
};

/**
 * Resolve the correct updater module to instantiate.
 * If `update` exists in `node_modules` of the cwd,
 * then that will be used to create the instance,
 * otherwise this module will be used.
 */

utils.resolveModule = function(dir) {
  dir = path.join(dir, 'node_modules/', pkg.name);
  if (utils.exists(dir)) {
    return require(path.resolve(dir));
  }
  return null;
};

/**
 * Print a tree of "updaters" and their tasks
 *
 * ```js
 * utils.tree(updaters);
 * ```
 */

utils.tree = function(updaters) {
  var res = '';
  for (var key in updaters) {
    res += utils.cyan(key) + '\n';
    for (var task in updaters[key].tasks) {
      res += ' - ' + task + '\n';
    }
  }
  return res;
};

/**
 * Return a list of "updaters" and their tasks
 *
 * ```js
 * utils.list(updaters);
 * ```
 */

utils.list = function(updaters) {
  var list = [];
  for (var key in updaters) {
    var updater = updaters[key];
    if (!Object.keys(updater.tasks).length) {
      continue;
    }

    var hasDefault = updater.tasks['default'];
    var name = updater.option('name');
    var item = {
      name: name + (hasDefault ? ' (default)' : ''),
      value: key,
      short: name + (hasDefault ? ':default' : '')
    };
    list.push(item);
    for (var task in updater.tasks) {
      if (task === 'default') continue;
      list.push({
        name: ' - ' + task,
        value: key + ':' + task,
        short: key + ':' + task
      });
    }
  }
  return list;
};

/**
 * Try to require a file
 */

utils.tryRequire = function(name) {
  try {
    return require(name);
  } catch (err) {
    console.log(err);
  }
  return null;
};

/**
 * Try to read a file
 */

utils.tryRead = function(fp) {
  try {
    return fs.readFileSync(fp);
  } catch (err) {}
  return null;
};

utils.tryParse = function(str) {
  try {
    return JSON.parse(str);
  } catch (err) {}
  return {};
};

utils.register = function(pattern, base, update, options) {
  utils.matchFiles(pattern, options).forEach(function(fp) {
    var name = utils.project(fp);
    var mod = utils.resolveModule(fp) || update;
    var app = mod(base.options)
        .option('name', name)
        .set('path', fp);

    require(utils.updatefile(fp))(app, base);
    base.updater(name, app);
  });
};

utils.opts = function(key) {
  key = key || 'opts';
  return function(app) {
    var name = this.options.name || 'base';
    this.define(key, function() {
      var config = this.defaults.apply(this, arguments);
      return function(key, opts) {
        var args = [].concat.apply([], [].slice.call(arguments));
        var prop = typeof key === 'string' ? args.shift() : null;
        var val;

        if (prop && !args.length) {
          val = utils.get(config, prop);
          if (val) return val;
        }

        var options = utils.extend.apply(utils.extend, [config].concat(args));
        return prop ? utils.get(options, prop) : options;
      };
    });
  };
};

utils.defaults = function(key) {
  key = key || 'defaults';
  return function(app) {
    this.define(key, function() {
      var args = [].concat.apply([], [].slice.call(arguments));
      args.unshift({}, this.options);
      return utils.extend.apply(utils.extend, args);
    });
  };
};

/**
 * Restore `require`
 */

require = fn;

/**
 * Expose `utils`
 */

module.exports = utils;

/**
 * Expose utils
 */

module.exports = utils;
