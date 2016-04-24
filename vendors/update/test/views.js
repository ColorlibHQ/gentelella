require('mocha');
require('should');
var path = require('path');
var assert = require('assert');
var typeOf = require('kind-of');
var support = require('./support');
var isBuffer = require('is-buffer');
var App = support.resolve();
var List = App.List;
var View = App.View;
var Views = App.Views;
var collection;

describe('views', function() {
  describe('constructor', function() {
    it('should create an instance of Views:', function() {
      var collection = new Views();
      assert(collection instanceof Views);
    });

    it('should instantiate without `new`:', function() {
      var collection = Views();
      assert(collection instanceof Views);
    });
  });

  describe('static methods', function() {
    it('should expose `extend`:', function() {
      assert(typeof Views.extend === 'function');
    });
  });

  describe('prototype methods', function() {
    beforeEach(function() {
      collection = new Views();
    });

    var methods = [
      'use',
      'setView',
      'addView',
      'addViews',
      'addList',
      'getView',
      'constructor',
      'set',
      'get',
      'del',
      'define',
      'visit',
      'on',
      'once',
      'off',
      'emit',
      'listeners',
      'hasListeners'
    ];

    methods.forEach(function(method) {
      it('should expose ' + method + ' method', function() {
        assert(typeof collection[method] === 'function');
      });
    });

    it('should expose isCollection property', function() {
      assert(typeof collection.isCollection === 'boolean');
    });

    it('should expose queue property', function() {
      assert(Array.isArray(collection.queue));
    });

    it('should expose views property', function() {
      assert(typeOf(collection.views) === 'object');
    });

    it('should expose options property', function() {
      assert(typeOf(collection.options) === 'object');
    });
  });

  describe('instance', function() {
    beforeEach(function() {
      collection = new Views();
    });

    it('should set a value on the instance:', function() {
      collection.set('a', 'b');
      assert(collection.a === 'b');
    });

    it('should get a value from the instance:', function() {
      collection.set('a', 'b');
      assert(collection.get('a') === 'b');
    });
  });

  describe('option', function() {
    beforeEach(function() {
      collection = new Views();
    });

    it('should set a key/value pair on options:', function() {
      collection.option('a', 'b');
      assert(collection.options.a === 'b');
    });

    it('should set an object on options:', function() {
      collection.option({c: 'd'});
      assert(collection.options.c === 'd');
    });

    it('should get an option:', function() {
      collection.option({c: 'd'});
      var c = collection.option('c');
      assert(c === 'd');
    });
  });

  describe('addView', function() {
    beforeEach(function() {
      collection = new Views();
    });

    it('should throw an error when args are invalid:', function() {
      (function() {
        collection.addView(function() {});
      }).should.throw('expected value to be an object.');
    });

    it('should add a view to `views`:', function() {
      collection.addView('foo');
      collection.views.should.have.property('foo');

      collection.addView('one', {content: '...'});
      assert(typeof collection.views.one === 'object');
      assert(isBuffer(collection.views.one.contents));
    });

    it('should create an instance of `View`:', function() {
      collection.addView('one', {content: '...'});
      assert(collection.views.one instanceof collection.View);
    });

    it('should allow an `View` constructor to be passed:', function() {
      View.prototype.foo = function(key, value) {
        this[key] = value;
      };
      collection = new Views({View: View});
      collection.addView('one', {content: '...'});
      collection.views.one.foo('bar', 'baz');
      assert(collection.views.one.bar === 'baz');
    });

    it('should allow an instance of `View` to be passed:', function() {
      var collection = new Views({View: View});
      var view = new View({content: '...'});
      collection.addView('one', view);
      view.set('abc', 'xyz');
      assert(collection.views.one instanceof collection.View);
      assert(isBuffer(collection.views.one.contents));
      assert(collection.views.one.abc === 'xyz');
    });

    it('should expose the `isType` method on items', function() {
      var collection = new Views({View: View});
      var view = new View({content: '...'});
      collection.setView('one', view);

      var one = collection.getView('one');
      assert(one.isType('renderable'));
    });

    it('should set viewTypes on a collection', function() {
      var collection = new Views({View: View});
      collection.viewType(['partial']);

      var view = new View({content: '...'});
      collection.setView('one', view);

      var one = collection.getView('one');
      assert(!one.isType('renderable'));
      assert(one.isType('partial'));
    });
  });

  describe('addViews', function() {
    beforeEach(function() {
      collection = new Views();
    });

    it('should emit an error if a string glob pattern is passed', function(done) {
      try {
        collection.addViews('*.js');
        done(new Error('expected an error'));
      } catch (err) {
        assert(err);
        assert(err.message);
        assert(/glob/.test(err.message));
        done();
      }
    });

    it('should emit an error if an array glob pattern is passed', function(done) {
      try {
        collection.addViews(['*.js']);
        done(new Error('expected an error'));
      } catch (err) {
        assert(err);
        assert(err.message);
        assert(/glob/.test(err.message));
        done();
      }
    });

    it('should add multiple views:', function() {
      collection.addViews({
        one: {content: 'foo'},
        two: {content: 'bar'}
      });
      assert(isBuffer(collection.views.one.contents));
      assert(isBuffer(collection.views.two.contents));
    });

    it('should return the collection instance for chaining:', function() {
      var views = collection.addViews({
        one: {content: 'foo'},
        two: {content: 'bar'}
      });

      var view = views.getView('one');
      assert(view);
      assert(view.content);
      assert(view.content === 'foo');
    });

    it('should create views from an instance of Views', function() {
      collection.addViews({
        one: {content: 'foo'},
        two: {content: 'bar'}
      });
      var pages = new Views(collection);
      assert(isBuffer(pages.views.one.contents));
      assert(isBuffer(pages.views.two.contents));
    });

    it('should add an array of views:', function() {
      collection.addViews([
        {path: 'one', content: 'foo'},
        {path: 'two', content: 'bar'}
      ]);
      assert(isBuffer(collection.views.one.contents));
      assert(isBuffer(collection.views.two.contents));
    });
  });

  describe('view', function() {
    beforeEach(function() {
      collection = new Views();
    });

    it('should return a single collection view from a key-value pair', function() {
      var one = collection.view('one', {content: 'foo'});
      var two = collection.view('two', {content: 'bar'});

      assert(one.isView);
      assert(one.path === 'one');
      assert(two.isView);
      assert(two.path === 'two');
    });

    it('should return a single collection view from an object', function() {
      var one = collection.view({path: 'one', content: 'foo'});
      var two = collection.view({path: 'two', content: 'bar'});

      assert(one.isView);
      assert(one.path === 'one');
      assert(two.isView);
      assert(two.path === 'two');
    });
  });

  describe('addList', function() {
    beforeEach(function() {
      collection = new Views();
    });

    it('should emit an error if a string glob pattern is passed', function(done) {
      try {
        collection.addList('*.js');
        done(new Error('expected an error'));
      } catch (err) {
        assert(err);
        assert(err.message);
        assert(/glob/.test(err.message));
        done();
      }
    });

    it('should emit an error if an array glob pattern is passed', function(done) {
      try {
        collection.addList(['*.js']);
        done(new Error('expected an error'));
      } catch (err) {
        assert(err);
        assert(err.message);
        assert(/glob/.test(err.message));
        done();
      }
    });

    it('should add a list of views:', function() {
      collection.addList([
        {path: 'one', content: 'foo'},
        {path: 'two', content: 'bar'}
      ]);
      assert(isBuffer(collection.views.one.contents));
      assert(isBuffer(collection.views.two.contents));
    });

    it('should add a list from the constructor:', function() {
      var list = new List([
        {path: 'one', content: 'foo'},
        {path: 'two', content: 'bar'}
      ]);

      collection = new Views(list);
      assert(isBuffer(collection.views.one.contents));
      assert(isBuffer(collection.views.two.contents));
    });

    it('should add list items from the constructor:', function() {
      var list = new List([
        {path: 'one', content: 'foo'},
        {path: 'two', content: 'bar'}
      ]);

      collection = new Views(list.items);
      assert(isBuffer(collection.views.one.contents));
      assert(isBuffer(collection.views.two.contents));
    });

    it('should throw an error when list is not an array:', function() {
      var views = new Views();
      (function() {
        views.addList();
      }).should.throw('expected list to be an array.');

      (function() {
        views.addList({});
      }).should.throw('expected list to be an array.');

      (function() {
        views.addList('foo');
      }).should.throw('expected list to be an array.');
    });

    it('should load an array of items from an event:', function() {
      var pages = new Views();

      pages.on('addList', function(list) {
        while (list.length) {
          pages.addView({path: list.pop()});
        }
        this.loaded = true;
      });

      pages.addList(['a.txt', 'b.txt', 'c.txt']);
      assert(pages.views.hasOwnProperty('a.txt'));
      assert(pages.views['a.txt'].path === 'a.txt');
    });

    it('should load an array of items from the addList callback:', function() {
      var collection = new Views();

      collection.addList(['a.txt', 'b.txt', 'c.txt'], function(fp) {
        return {path: fp};
      });
      assert(collection.views.hasOwnProperty('a.txt'));
      assert(collection.views['a.txt'].path === 'a.txt');
    });

    it('should load an object of views from an event:', function() {
      var collection = new Views();

      collection.on('addViews', function(views) {
        for (var key in views) {
          collection.addView('foo/' + key, views[key]);
          delete views[key];
        }
      });

      collection.addViews({
        a: {path: 'a.txt'},
        b: {path: 'b.txt'},
        c: {path: 'c.txt'}
      });

      assert(collection.views.hasOwnProperty('foo/a'));
      assert(collection.views['foo/a'].path === 'a.txt');
    });

    it('should signal `loaded` when finished:', function() {
      var collection = new Views();

      collection.on('addViews', function(views) {
        for (var key in views) {
          if (key === 'c') break;
          collection.addView('foo/' + key, views[key]);
        }
      });

      collection.addViews({
        a: {path: 'a.txt'},
        b: {path: 'b.txt'},
        c: {path: 'c.txt'}
      });

      assert(collection.views.hasOwnProperty('foo/a'));
      assert(!collection.views.hasOwnProperty('foo/c'));
      assert(collection.views['foo/a'].path === 'a.txt');
    });
  });

  describe('getView', function() {
    beforeEach(function() {
      collection = new Views();
    });
    it('should get a view from `views`:', function() {
      collection.addView('one', {content: 'aaa'});
      collection.addView('two', {content: 'zzz'});
      assert(isBuffer(collection.views.one.contents));
      assert(isBuffer(collection.getView('one').contents));
      assert(collection.getView('one').contents.toString() === 'aaa');
      assert(collection.getView('two').contents.toString() === 'zzz');
    });
  });

  describe('count', function() {
    beforeEach(function() {
      collection = new Views();
    });

    it('should get the number of views:', function() {
      collection.addView('one', {content: 'aaa'});
      collection.addView('two', {content: 'zzz'});
      assert(Object.keys(collection.views).length === 2);
    });
  });
});

describe('options', function() {
  describe('options.renameKey', function() {
    beforeEach(function() {
      collection = new Views({
        renameKey: function(key) {
          return path.basename(key);
        }
      });
    });

    it('should use a custom rename key function on view keys', function() {
      collection.addView('a/b/c/d.hbs', {content: 'foo bar baz'});
      assert(collection.views['d.hbs'].contents.toString() === 'foo bar baz');
    });

    it('should get a view with the renamed key:', function() {
      collection.addView('a/b/c/d.hbs', {content: 'foo bar baz'});
      assert(collection.getView('d.hbs').contents.toString() === 'foo bar baz');
    });

    it('should get a view with the original key:', function() {
      collection.addView('a/b/c/d.hbs', {content: 'foo bar baz'});
      assert(collection.getView('a/b/c/d.hbs').contents.toString() === 'foo bar baz');
    });
  });
});

describe('queue', function() {
  beforeEach(function() {
    collection = new Views();
  });

  it('should emit arguments on addView', function(done) {
    collection.on('addView', function(args) {
      assert(args[0] === 'a');
      assert(args[1] === 'b');
      assert(args[2] === 'c');
      assert(args[3] === 'd');
      assert(args[4] === 'e');
      done();
    });

    collection.addView('a', 'b', 'c', 'd', 'e');
  });

  it('should expose the `queue` property for loading views', function() {
    collection.queue.push(collection.view('b', {path: 'b'}));

    collection.addView('a', {path: 'a'});
    assert(collection.views.hasOwnProperty('a'));
    assert(collection.views.hasOwnProperty('b'));
  });

  it('should load all views on the queue when addView is called', function() {
    collection.on('addView', function(args) {
      var len = args.length;
      var last = args[len - 1];
      if (typeof last === 'string') {
        args[len - 1] = { content: last };
      }
    });

    collection.addView('a.html', 'aaa');
    collection.addView('b.html', 'bbb');
    collection.addView('c.html', 'ccc');

    assert(collection.views.hasOwnProperty('a.html'));
    assert(collection.getView('a.html').content === 'aaa');
    assert(collection.views.hasOwnProperty('b.html'));
    assert(collection.getView('b.html').content === 'bbb');
    assert(collection.views.hasOwnProperty('c.html'));
    assert(collection.getView('c.html').content === 'ccc');
  });
});
