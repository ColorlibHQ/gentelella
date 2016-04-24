require('mocha');
require('should');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var resolve = require('resolve-glob');
var support = require('./support');
var App = support.resolve();
var app;

describe('lookups', function() {
  beforeEach(function() {
    app = new App();
    app.option('renameKey', function(key) {
      return path.basename(key);
    });
    app.create('pages')
      .use(function(pages) {
        pages.on('addViews', function(glob) {
          var files = resolve.sync(glob);
          files.forEach(function(fp) {
            pages.addView(fp, {path: fp});
          });
          pages.loaded = true;
        });
        return function(view) {
          view.read = function() {
            this.contents = fs.readFileSync(this.path);
          };
          return view;
        };
      });

    app.pages('test/fixtures/templates/*.tmpl');
  });

  describe('getView', function() {
    it('should find a view', function() {
      var view = app.getView('pages', 'a.tmpl');
      assert(typeof view.path === 'string');
    });

    it('should find a view using the renameKey function', function() {
      var view = app.getView('pages', 'test/fixtures/templates/a.tmpl');
      assert(typeof view.path === 'string');
    });

    it('should return null when nothing is found', function() {
      var view = app.getView('pages', 'test/fixtures/templates/foo.tmpl');
      assert(view === null);
    });

    it('should find a view using a glob pattern', function() {
      var view = app.getView('pages', 'a', function(key) {
        return key + '.tmpl';
      });
      assert(typeof view.path === 'string');
    });
  });

  describe('getViews', function() {
    it('should return the collection object if passed:', function() {
      var views = app.getViews(app.views.pages);
      assert(Object.keys(views).length > 1);
    });

    it('should return the specified collection with the plural name:', function() {
      var views = app.getViews('pages');
      assert(Object.keys(views).length > 1);
    });

    it('should return the specified collection with the singular name:', function() {
      var views = app.getViews('page');
      assert(Object.keys(views).length > 1);
    });

    it('should return null when the collection is not found:', function() {
      (function() {
        app.getViews('nada');
      }).should.throw('getViews cannot find collection: nada');
    });
  });

  describe('find', function() {
    it('should return null when a view is not found:', function() {
      (function() {
        app.find({});
      }).should.throw('expected name to be a string.');
    });

    it('should find a view by collection name:', function() {
      var view = app.find('a.tmpl', 'pages');
      assert(typeof view.path === 'string');
    });

    it('should find a view by collection name:', function() {
      app = new App();
      app.option('renameKey', function(key) {
        return path.basename(key);
      });
      app.create('pages');
      app.page('a/b/c.md', {content: '...'});
      var view = app.find('a/b/c.md');
      assert(typeof view.path === 'string');
    });

    it('should find a view without a collection name:', function() {
      var view = app.find('a.tmpl');
      assert(typeof view.path === 'string');
    });
  });
});
