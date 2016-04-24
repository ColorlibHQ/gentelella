'use strict';

require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;
var page = {
  content: '<%= name %>',
  layout: 'default.tmpl',
  locals: {
    name: 'Halle'
  }
};

describe('helpers', function() {
  describe('rendering', function() {
    beforeEach(function() {
      app = new App();
      app.engine('tmpl', require('engine-base'));
      app.create('layout', { viewType: 'layout' });
      app.create('page');
    });

    it('should throw an error when a layout cannot be found:', function(cb) {
      app.layout('fofof.tmpl', {content: '..'});
      app.page('a.tmpl', page)
        .render(function(err) {
          assert.equal(err.message, 'Templates#layouts layout "default.tmpl" was defined on view "a.tmpl"\nbut cannot be not found (common causes are incorrect glob patterns,\nrenameKey function modifying the key, and typos in search pattern)');
          cb();
        });
    });

    it('should emit an error when a layout cannot be found:', function(cb) {
      app.layout('fofof.tmpl', {content: '..'});
      app.on('error', function(err) {
        assert.equal(err.message, 'Templates#layouts layout "default.tmpl" was defined on view "a.tmpl"\nbut cannot be not found (common causes are incorrect glob patterns,\nrenameKey function modifying the key, and typos in search pattern)');
        cb();
      });

      app.page('a.tmpl', page)
        .render(function() {
        });
    });

    it('should throw an error - layout defined but no layouts registered:', function(cb) {
      app.page('a.tmpl', page)
        .render(function(err) {
          assert.equal(err.message, 'Templates#layouts layout "default.tmpl" was defined on view "a.tmpl"\nbut cannot be not found (common causes are incorrect glob patterns,\nrenameKey function modifying the key, and typos in search pattern)');
          cb();
        });
    });

    it('should emit an error - layout defined but no layouts registered:', function(cb) {
      app.on('error', function(err) {
        assert.equal(err.message, 'Templates#layouts layout "default.tmpl" was defined on view "a.tmpl"\nbut cannot be not found (common causes are incorrect glob patterns,\nrenameKey function modifying the key, and typos in search pattern)');
        cb();
      });
      app.page('a.tmpl', page)
        .render(function() {
        });
    });

    it('should wrap a view with a layout (view.render):', function(cb) {
      app.layout('default.tmpl', {content: 'before {% body %} after'});
      app.page('a.tmpl', page)
        .render(function(err) {
          if (err) return cb(err);
          cb();
        });
    });

    it('should wrap a view with a layout (app.render):', function(cb) {
      app.layout('default.tmpl', {content: 'before {% body %} after'});
      app.page('a.tmpl', page);

      var view = app.pages.getView('a.tmpl');
      app.render(view, function(err, res) {
        if (err) return cb(err);
        assert(res.contents.toString() === 'before Halle after');
        cb();
      });
    });
  });
});

