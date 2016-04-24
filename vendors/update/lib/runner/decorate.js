'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = function(options) {
  return function(app) {

    this.define('decorate', function(name, app, options) {
      app.option('name', name)
        .option('fullname', options.fullname || name)
        .option('path', options.path || '');

      app.create('templates', {
        cwd: path.resolve(options.path, 'templates'),
        renameKey: function(key) {
          return path.basename(key);
        }
      });

      var base = this.base;

      app.define('getFile', function(name) {
        var view = base.files.getView.apply(base.files, arguments);
        if (!view) {
          view = app.templates.getView.apply(app.templates, arguments);
        }
        if (!view) return null;
        view.basename = view.basename.replace(/^_/, '.');
        view.basename = view.basename.replace(/^$/, '');
        return view;
      });

      base.define('getFile', app.getFile);
      base.files.getFile = base.files.getView.bind(base.files);
      return this;
    });
  };
};
