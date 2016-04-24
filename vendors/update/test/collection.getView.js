'use strict';

var path = require('path');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('collection.getView', function() {
  beforeEach(function() {
    app = new App();
    app.create('page');

    app.page('foo', {content: 'this is foo'});
    app.page('bar.md', {content: 'this is bar'});
    app.page('a/b/c/baz.md', {content: 'this is baz'});
    app.page('test/fixtures/templates/a.tmpl');
  });

  it('should get a view by name', function() {
    assert(app.pages.getView('foo'));
  });

  it('should get a view with the key modified by the given function', function() {
    var view = app.pages.getView('foo.md', function(key) {
      return path.basename(key, path.extname(key));
    });
    assert(view);
  });

  it('should get a view by full path', function() {
    assert(app.pages.getView('a/b/c/baz.md'));
  });
});
