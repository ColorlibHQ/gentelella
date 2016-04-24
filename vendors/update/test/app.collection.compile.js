require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var Views = App.Views;
var views;

describe('compile', function() {
  beforeEach(function() {
    views = new Views();
  });

  it('should throw an error when an engine cannot be found:', function() {
    views.addView('foo.bar', {content: '<%= name %>'});
    var page = views.getView('foo.bar');
    (function() {
      views.compile(page);
    }).should.throw('Views#compile cannot find an engine for: .bar');
  });

  it('should compile a template:', function() {
    views.engine('tmpl', require('engine-base'));
    views.addView('a.tmpl', {path: 'a.tmpl', content: '<%= a %>', a: 'b'});

    var page = views.getView('a.tmpl');
    var view = views.compile(page);
    assert.equal(typeof view.fn, 'function');
  });

  it('should compile a template by name:', function() {
    views.engine('tmpl', require('engine-base'));
    views.addView('a.tmpl', {path: 'a.tmpl', content: '<%= a %>', a: 'b'});

    var view = views.compile('a.tmpl');
    assert.equal(typeof view.fn, 'function');
  });

  it('should throw an error when a callback is given:', function() {
    views.engine('md', require('engine-base'));
    views.addView('foo.md', {content: '<%= name %>'});
    var page = views.getView('foo.md');
    (function() {
      views.compile(page, function() {});
    }).should.throw('Views#compile is sync and does not take a callback function');

    (function() {
      views.compile(page, {}, function() {});
    }).should.throw('Views#compile is sync and does not take a callback function');
  });
});
