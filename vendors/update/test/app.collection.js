'use strict';

require('mocha');
require('should');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var define = require('define-property');
var support = require('./support');
var App = support.resolve();
var Collection = App.Collection;
var app;

describe('collection', function() {
  describe('method', function() {
    beforeEach(function() {
      app = new App();
    });

    it('should expose the collection method', function() {
      assert(typeof app.collection === 'function');
    });

    it('should return a new collection', function() {
      var collection = app.collection();
      assert(typeof collection === 'object');
    });

    it('should have isCollection property', function() {
      var collection = app.collection();
      assert(collection.isCollection === true);
    });
  });

  describe('adding views', function() {
    beforeEach(function() {
      app = new App()
        .use(function() {
          return function() {
            define(this, 'count', {
              get: function() {
                return Object.keys(this.views).length;
              },
              set: function() {
                throw new Error('count is a read-only getter and cannot be defined.');
              }
            });
          };
        });

      app.engine('tmpl', require('engine-base'));
      app.create('pages', {
        renameKey: function(fp) {
          return path.relative(process.cwd(), fp);
        }
      });
    });

    it('should load a view onto the respective collection:', function() {
      app.pages('test/fixtures/pages/a.hbs');
      app.views.pages.should.have.property('test/fixtures/pages/a.hbs');
    });

    it('should allow collection methods to be chained:', function() {
      app
        .pages('test/fixtures/pages/a.hbs')
        .pages('test/fixtures/pages/b.hbs')
        .pages('test/fixtures/pages/c.hbs');

      app.views.pages.should.have.properties([
        'test/fixtures/pages/a.hbs',
        'test/fixtures/pages/b.hbs',
        'test/fixtures/pages/c.hbs'
      ]);
    });

    it('should expose the `option` method:', function() {
      app.pages.option('foo', 'bar')
        .pages('test/fixtures/pages/a.hbs')
        .pages('test/fixtures/pages/b.hbs')
        .pages('test/fixtures/pages/c.hbs');

      app.pages.options.should.have.property('foo', 'bar');
      app.views.pages.should.have.properties([
        'test/fixtures/pages/a.hbs',
        'test/fixtures/pages/b.hbs',
        'test/fixtures/pages/c.hbs'
      ]);
    });

    it('should expose the `option` method:', function() {
      app.pages.option('foo', 'bar')
        .pages('test/fixtures/pages/a.hbs')
        .pages('test/fixtures/pages/b.hbs')
        .pages('test/fixtures/pages/c.hbs');

      assert(app.pages.count === 3);
    });
  });

  describe('addItem', function() {
    beforeEach(function() {
      app = new App();
    });

    it('should add items to a collection', function() {
      var pages = app.collection({Collection: Collection});
      pages.addItem('foo');
      pages.addItem('bar');
      pages.addItem('baz');

      pages.items.hasOwnProperty('foo');
      pages.items.hasOwnProperty('bar');
      pages.items.hasOwnProperty('baz');
    });

    it('should create a collection from an existing collection:', function() {
      var pages = app.collection({Collection: Collection});
      pages.addItem('foo');
      pages.addItem('bar');
      pages.addItem('baz');

      var posts = app.collection(pages);
      posts.items.hasOwnProperty('foo');
      posts.items.hasOwnProperty('bar');
      posts.items.hasOwnProperty('baz');
    });
  });

  describe('rendering views', function() {
    beforeEach(function() {
      app = new App();
      app.engine('tmpl', require('engine-base'));
      app.create('pages');
      app.cache.data = {};
    });

    it('should render a view with inherited app.render', function(cb) {
      app.page('test/fixtures/templates/a.tmpl')
        .use(function(view) {
          view.contents = fs.readFileSync(view.path);
        })
        .set('data.name', 'Brian')
        .render(function(err, res) {
          if (err) return cb(err);
          assert(res.content === 'Brian');
          cb();
        });
    });
  });
});

describe('collection singular method', function() {
  describe('create', function() {
    beforeEach(function() {
      app = new App();
    });

    it('should add a pluralized collection from singular name', function() {
      app.create('page');
      assert(typeof app.views.pages === 'object');
    });
  });

  describe('adding views', function() {
    beforeEach(function() {
      app = new App();
      app.engine('tmpl', require('engine-base'));
      app.create('page', {
        renameKey: function(fp) {
          return path.relative(process.cwd(), fp);
        }
      });
    });

    it('should add a view to the created collection:', function() {
      app.page('test/fixtures/pages/a.hbs');
      assert(typeof app.views.pages['test/fixtures/pages/a.hbs'] === 'object');
    });

    it('should expose the `option` method:', function() {
      app.pages.option('foo', 'bar');
      app.pages.options.should.have.property('foo', 'bar');
    });
  });
});
