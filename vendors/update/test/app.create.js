require('mocha');
require('should');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('create', function() {
  describe('inflections', function() {
    beforeEach(function() {
      app = new App();
    });

    it('should expose the create method', function() {
      assert(typeof app.create === 'function');
    });

    it('should add a collection to `views`', function() {
      app.create('pages');
      assert(typeof app.views.pages === 'object');
      assert(typeof app.pages === 'function');
    });

    it('should add a pluralized collection to `views`', function() {
      app.create('page');
      assert(typeof app.views.pages === 'object');
      assert(typeof app.page === 'function');
    });
  });

  describe('renderable views', function() {
    beforeEach(function() {
      app = new App();
      app.create('pages');
      app.create('partials', {viewType: 'partial'});
      app.create('layout', {viewType: 'layout'});
    });

    it('should add renderable views when no type is defined', function() {
      app.pages.addView('foo', {content: 'bar'});
      assert(app.views.pages.hasOwnProperty('foo'));
    });

    it('should add view Ctor names to views', function() {
      app.pages.addView('foo', {content: 'bar'});
      assert(app.views.pages.foo._name === 'Page');
    });

    it('should add partial views when partial type is defined', function() {
      app.partials.addView('abc', {content: 'xyz'});
      assert(app.views.partials.hasOwnProperty('abc'));
    });

    it('should add layout views when layout type is defined', function() {
      app.layouts.addView('foo', {content: 'bar'});
      assert(app.views.layouts.hasOwnProperty('foo'));
    });

    it('should set viewType on renderable views', function() {
      app.pages.addView('foo', {content: 'bar'});
      var view = app.pages.getView('foo');
      assert(view.isType('renderable'));
      assert(!view.isType('layout'));
      assert(!view.isType('partial'));
    });

    it('should set viewType on partial views', function() {
      app.partials.addView('foo', {content: 'bar'});
      var view = app.partials.getView('foo');
      assert(view.isType('partial'));
      assert(!view.isType('layout'));
      assert(!view.isType('renderable'));
    });

    it('should set viewType on layout views', function() {
      app.layouts.addView('foo', {content: 'bar'});
      var view = app.layouts.getView('foo');
      assert(view.isType('layout'));
      assert(!view.isType('renderable'));
      assert(!view.isType('partial'));
    });
  });

  describe('custom constructors', function() {
    beforeEach(function() {
      var Vinyl = require('vinyl');
      Vinyl.prototype.custom = function(key) {
        this[key] = 'nonsense';
        return this;
      };
      app = new App({View: Vinyl});
      app.create('pages');
    });

    it('should create views from key-value pairs:', function() {
      app.page('a.hbs', {path: 'a.hbs', content: 'a'});
      app.page('b.hbs', {path: 'b.hbs', content: 'b'});
      app.page('c.hbs', {path: 'c.hbs', content: 'c'});
      var a = app.pages.getView('a.hbs');
      a.custom('foo');
      a.foo.should.equal('nonsense');
    });
  });

  describe('custom instances', function() {
    it('should create views from custom `View` and `Views` instance/ctor:', function() {
      var Vinyl = require('vinyl');
      Vinyl.prototype.read = function(file) {
        return fs.readFileSync(file.path);
      };

      var Views = App.Views;
      var views = new Views({View: Vinyl});

      views.addView('a.hbs', {path: 'a.hbs', content: 'a'});
      views.addView('b.hbs', {path: 'b.hbs', content: 'b'});
      views.addView('c.hbs', {path: 'c.hbs', content: 'c'});

      app = new App();
      app.create('pages', views);

      var a = app.pages.getView('a.hbs');
      assert(a instanceof Vinyl);
      assert(Vinyl.isVinyl(a));
      assert(typeof a.read === 'function');

      views.addView('d.hbs', {path: 'd.hbs', content: 'd'});
      var d = app.pages.getView('d.hbs');
      assert(d instanceof Vinyl);
      assert(Vinyl.isVinyl(d));
    });
  });

  describe('chaining', function() {
    beforeEach(function() {
      app = new App();
      app.engine('tmpl', require('engine-base'));
      app.create('page', {
        renameKey: function(fp) {
          return path.relative(process.cwd(), fp);
        }
      });
    });

    it('should create views from key-value pairs:', function() {
      app.page('a.hbs', {content: 'a'});
      app.page('b.hbs', {content: 'b'});
      app.page('c.hbs', {content: 'c'});
      app.views.pages.should.have.properties(['a.hbs', 'b.hbs', 'c.hbs']);
      assert(app.views.pages['a.hbs'].contents.toString() === 'a');
    });

    it('should create views from file paths:', function() {
      app.page('test/fixtures/pages/a.hbs');
      app.page('test/fixtures/pages/b.hbs');
      app.page('test/fixtures/pages/c.hbs');

      app.views.pages.should.have.properties([
        'test/fixtures/pages/a.hbs',
        'test/fixtures/pages/b.hbs',
        'test/fixtures/pages/c.hbs'
      ]);
    });
  });

  describe('instance', function() {
    beforeEach(function() {
      app = new App();
      app.engine('tmpl', require('engine-base'));
    });

    it('should return the collection instance', function() {
      var collection = app.create('pages');
      assert(collection instanceof App.Views);

      collection.option('renameKey', function(key) {
        return path.basename(key);
      });
      collection
        .use(function(views) {
          views.read = function(name) {
            var view = this.getView(name);
            view.contents = fs.readFileSync(view.path);
          };
        });

      collection.addView('test/fixtures/templates/a.tmpl');
      collection.read('a.tmpl');
      assert(collection.getView('a.tmpl').contents.toString() === '<%= name %>');
    });
  });

  describe('viewType', function() {
    beforeEach(function() {
      app = new App();
      app.engine('tmpl', require('engine-base'));
    });

    it('should add collection to the given viewType', function() {
      app.create('layout', {viewType: 'layout'});
      assert(app.layouts.options.viewType[0] === 'layout');
    });

    it('should add a collection to multiple viewTypes', function() {
      app.create('foo', {viewType: ['layout', 'renderable']});
      assert.deepEqual(app.foos.options.viewType, ['layout', 'renderable']);
    });
  });

  describe('events', function() {
    beforeEach(function() {
      app = new App();
      app.engine('tmpl', require('engine-base'));
    });

    it('should emit `create` when a collection is created:', function() {
      app.on('create', function(collection) {
        if (collection.options.plural === 'layouts') {
          collection.options.foo = 'bar';
        }
      });

      app.create('layout');
      app.layout('one', {path: 'two', contents: '...'});
      assert(app.layouts.options.foo === 'bar');
    });
  });

  describe('collection instantiation', function() {
    it('should expose collection instance methods that are created after instantiation on the app collection loader', function() {
      app.create('pages');
      app.pages.use(function(collection) {
        collection.define('foo', function(msg) {
          return 'foo ' + msg;
        });
      });

      assert(app.pages.foo);
      assert(typeof app.pages.foo === 'function');
    });
  });
});
