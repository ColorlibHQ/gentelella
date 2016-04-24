require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('app.view.compile', function() {
  describe('compile method', function() {
    beforeEach(function() {
      app = new App();
      app.engine('tmpl', require('engine-base'));
      app.create('page');
    });

    it('should compile a view:', function() {
      var buffer = new Buffer('a b c');
      var view = app.page('a.tmpl', {contents: buffer})
        .compile();
      assert(typeof view.fn === 'function');
    });

    it('should compile a view with settings:', function() {
      var buffer = new Buffer('a b c');
      var view = app.page('a.tmpl', {contents: buffer})
        .compile({foo: 'bar'});
      assert(typeof view.fn === 'function');
    });

    it('should compile a view with isAsync flag:', function() {
      var buffer = new Buffer('a b c');
      var view = app.page('a.tmpl', {contents: buffer})
        .compile(true);
      assert(typeof view.fn === 'function');
    });
  });
});

