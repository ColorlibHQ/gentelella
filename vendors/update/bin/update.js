#!/usr/bin/env node

var path = require('path');
var gm = require('global-modules');
var Runner = require('../lib/runner/runner')();
var utils = require('../lib/utils');
var argv = require('minimist')(process.argv.slice(2), {
  alias: {verbose: 'v'}
});

var cmd = utils.commands(argv);
var runner = new Runner(argv);

runner.base.option(argv);
runner.option(argv);

var task = cmd.list ? ['list', 'default'] : ['default'];

runner.on('*', function(method, key, val) {
  console.log(method + ':', key, val);
});

if (argv.verbose) {
  runner.on('register', function(key) {
    utils.ok(utils.gray('registered'), 'updater', utils.cyan(key));
  });
}

runner.registerEach('update-*', {cwd: gm});

runner.base.task('run', function(cb) {
  runner.run(cb);
});

runner.base.build(task, function(err) {
  if (err) return console.error(err);
  utils.timestamp('finished ' + utils.green(utils.successSymbol));
});
