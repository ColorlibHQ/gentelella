'use strict';

var path = require('path');
var async = require('async');
var rimraf = require('rimraf');

var list = ['.npmignore', '.jshintrc', '.eslintrc'];

module.exports = function(app, base, env) {
  var files = base.option('delete') || list;

  return function(cb) {
    async.each(files, function(fp, next) {
      rimraf(path.resolve(process.cwd(), fp), next);
    }, cb);
  };
};
