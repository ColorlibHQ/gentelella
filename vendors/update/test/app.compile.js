require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('compile', function() {
  beforeEach(function() {
    app = new App();
    app.create('page');
  });

  it('should throw an error when an engine cannot be found:', function() {
    app.page('foo.bar', {content: '<%= name %>'});
    var page = app.pages.getView('foo.bar');
    (function() {
      app.compile(page);
    }).should.throw('Templates#compile cannot find an engine for: .bar');
  });

  it('should compile a template:', function() {
    app.engine('tmpl', require('engine-base'));
    app.pages('a.tmpl', {path: 'a.tmpl', content: '<%= a %>', a: 'b'});

    var page = app.pages.getView('a.tmpl');
    var view = app.compile(page);
    assert.equal(typeof view.fn, 'function');
  });

  it('should compile a template by name:', function() {
    app.engine('tmpl', require('engine-base'));
    app.pages('a.tmpl', {path: 'a.tmpl', content: '<%= a %>', a: 'b'});

    var view = app.compile('a.tmpl');
    assert.equal(typeof view.fn, 'function');
  });

  it('should throw an error when a callback is given:', function() {
    app.engine('md', require('engine-base'));
    app.page('foo.md', {content: '<%= name %>'});
    var page = app.pages.getView('foo.md');
    (function() {
      app.compile(page, function() {
      });
    }).should.throw('Templates#compile is sync and does not take a callback function');

    (function() {
      app.compile(page, {}, function() {
      });
    }).should.throw('Templates#compile is sync and does not take a callback function');
  });
});
