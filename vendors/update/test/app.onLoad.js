require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('onLoad', function() {
  beforeEach(function() {
    app = new App();
  });

  describe('app.collection', function() {
    it('should emit an onLoad when view is created', function(done) {
      var collection = app.collection();

      app.on('onLoad', function(view) {
        assert(view.path === 'blog/foo.js');
        done();
      });

      app.onLoad('blog/:title', function(view, next) {
        assert(view.path === 'blog/foo.js');
        next();
      });

      collection.addView('whatever', {path: 'blog/foo.js', content: 'bar baz'});
    });
  });

  describe('view collections', function() {
    it('should emit an onLoad when view is created', function(done) {
      app.create('posts');

      app.on('onLoad', function(view) {
        assert(view.path === 'blog/foo.js');
        done();
      });

      app.onLoad('blog/:title', function(view, next) {
        assert(view.path === 'blog/foo.js');
        next();
      });

      app.post('whatever', {path: 'blog/foo.js', content: 'bar baz'});
    });
  });
});
