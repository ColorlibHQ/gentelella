require('mocha');
require('should');
var path = require('path');
var assert = require('assert');
var typeOf = require('kind-of');
var isBuffer = require('is-buffer');
var support = require('./support');
var App = support.resolve();
var List = App.List;
var Item = App.Item;
var Collection = App.Collection;
var collection;

describe('collection', function() {
  describe('constructor', function() {
    it('should create an instance of Collection', function() {
      var collection = new Collection();
      assert(collection instanceof Collection);
      assert(typeof collection === 'object');
    });

    it('should instantiate without new', function() {
      var collection = Collection();
      assert(collection instanceof Collection);
      assert(typeof collection === 'object');
    });
  });

  describe('static methods', function() {
    it('should expose `extend`', function() {
      assert(typeof Collection.extend === 'function');
    });
  });

  describe('prototype methods', function() {
    beforeEach(function() {
      collection = new Collection();
    });

    var methods = [
      'use',
      'setItem',
      'addItem',
      'addItems',
      'addList',
      'getItem',
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

    it('should expose items property', function() {
      assert(typeOf(collection.items) === 'object');
    });

    it('should expose options property', function() {
      assert(typeOf(collection.options) === 'object');
    });
  });
});

describe('methods', function() {
  beforeEach(function() {
    collection = new Collection();
  });

  describe('chaining', function() {
    it('should allow collection methods to be chained', function() {
      collection
        .addItems({'a.hbs': {path: 'a.hbs'}})
        .addItems({'b.hbs': {path: 'b.hbs'}})
        .addItems({'c.hbs': {path: 'c.hbs'}});

      collection.items.should.have.properties([
        'a.hbs',
        'b.hbs',
        'c.hbs'
      ]);
    });
  });

  describe('use', function() {
    it('should expose the instance to plugins', function() {
      collection
        .use(function(inst) {
          inst.foo = 'bar';
        });

      assert(collection.foo === 'bar');
    });

    it('should expose `item` when the plugin returns a function', function() {
      collection
        .use(function() {
          return function(item) {
            item.foo = 'bar';
          };
        });

      collection.addItem('aaa');
      collection.addItem('bbb');
      collection.addItem('ccc');

      assert(collection.items.aaa.foo === 'bar');
      assert(collection.items.bbb.foo === 'bar');
      assert(collection.items.ccc.foo === 'bar');
    });
  });

  describe('get / set', function() {
    it('should set a value on the instance', function() {
      collection.set('a', 'b');
      assert(collection.a === 'b');
    });

    it('should get a value from the instance', function() {
      collection.set('a', 'b');
      assert(collection.get('a') === 'b');
    });
  });

  describe('adding items', function() {
    beforeEach(function() {
      collection = new Collection();
    });

    it('should load a item onto the respective collection', function() {
      collection.addItem('a.hbs');
      collection.items.should.have.property('a.hbs');
    });
  });

  describe('item', function() {
    beforeEach(function() {
      collection = new Collection();
    });

    it('should return a single collection item from a key-value pair', function() {
      var one = collection.item('one', {content: 'foo'});
      var two = collection.item('two', {content: 'bar'});

      assert(one instanceof Item);
      assert(one instanceof collection.Item);
      assert(one.path === 'one');
      assert(two instanceof Item);
      assert(two instanceof collection.Item);
      assert(two.path === 'two');
    });

    it('should return a single collection item from an object', function() {
      var one = collection.item({path: 'one', content: 'foo'});
      var two = collection.item({path: 'two', content: 'bar'});

      assert(one instanceof Item);
      assert(one.path === 'one');
      assert(two instanceof Item);
      assert(two.path === 'two');
    });
  });

  describe('addItem', function() {
    beforeEach(function() {
      collection = new Collection();
    });

    it('should throw an error when args are invalid', function() {
      (function() {
        collection.addItem(function() {});
      }).should.throw('expected value to be an object.');
    });

    it('should add a item to `items`', function() {
      collection.addItem('foo');
      collection.items.should.have.property('foo');

      collection.addItem('one', {content: '...'});
      assert(typeof collection.items.one === 'object');
      assert(isBuffer(collection.items.one.contents));
    });

    it('should create an instance of `Item`', function() {
      collection.addItem('one', {content: '...'});
      assert(collection.items.one instanceof collection.Item);
    });

    it('should allow an `Item` constructor to be passed', function() {
      Item.prototype.foo = function(key, value) {
        this[key] = value;
      };
      collection = new Collection({Item: Item});
      collection.addItem('one', {content: '...'});
      collection.items.one.foo('bar', 'baz');
      assert(collection.items.one.bar === 'baz');
    });

    it('should allow an instance of `Item` to be passed', function() {
      var collection = new Collection({Item: Item});
      var item = new Item({content: '...'});
      collection.addItem('one', item);
      item.set('abc', 'xyz');
      assert(collection.items.one instanceof collection.Item);
      assert(isBuffer(collection.items.one.contents));
      assert(collection.items.one.abc === 'xyz');
    });
  });

  describe('addItems', function() {
    beforeEach(function() {
      collection = new Collection();
    });

    it('should add multiple items', function() {
      collection.addItems({
        one: {content: 'foo'},
        two: {content: 'bar'}
      });
      assert(isBuffer(collection.items.one.contents));
      assert(isBuffer(collection.items.two.contents));
    });

    it('should create items from an instance of Collection', function() {
      collection.addItems({
        one: {content: 'foo'},
        two: {content: 'bar'}
      });
      var pages = new Collection(collection);
      assert(isBuffer(pages.items.one.contents));
      assert(isBuffer(pages.items.two.contents));
    });

    it('should add an array of plain-objects', function() {
      collection.addItems([
        {path: 'one', content: 'foo'},
        {path: 'two', content: 'bar'}
      ]);
      assert(isBuffer(collection.items.one.contents));
      assert(isBuffer(collection.items.two.contents));
    });

    it('should add an array of items', function() {
      var list = new List([
        {path: 'one', content: 'foo'},
        {path: 'two', content: 'bar'}
      ]);

      collection.addItems(list.items);
      assert(isBuffer(collection.items.one.contents));
      assert(isBuffer(collection.items.two.contents));
    });
  });

  describe('addList', function() {
    beforeEach(function() {
      collection = new Collection();
    });

    it('should add a list of items', function() {
      collection.addList([
        {path: 'one', content: 'foo'},
        {path: 'two', content: 'bar'}
      ]);
      assert(isBuffer(collection.items.one.contents));
      assert(isBuffer(collection.items.two.contents));
    });

    it('should add a list of items from the constructor', function() {
      var list = new List([
        {path: 'one', content: 'foo'},
        {path: 'two', content: 'bar'}
      ]);

      collection = new Collection(list);
      assert(isBuffer(collection.items.one.contents));
      assert(isBuffer(collection.items.two.contents));
    });

    it('should throw an error when list is not an array', function() {
      var items = new Collection();
      (function() {
        items.addList();
      }).should.throw('expected list to be an array.');

      (function() {
        items.addList({});
      }).should.throw('expected list to be an array.');

      (function() {
        items.addList('foo');
      }).should.throw('expected list to be an array.');
    });

    it('should load an array of items from an event', function() {
      var collection = new Collection();

      collection.on('addList', function(list) {
        while (list.length) {
          collection.addItem({path: list.pop()});
        }
      });

      collection.addList(['a.txt', 'b.txt', 'c.txt']);
      assert(collection.items.hasOwnProperty('a.txt'));
      assert(collection.items['a.txt'].path === 'a.txt');
    });

    it('should load an array of items from the addList callback:', function() {
      var collection = new Collection();

      collection.addList(['a.txt', 'b.txt', 'c.txt'], function(fp) {
        return {path: fp};
      });
      assert(collection.items.hasOwnProperty('a.txt'));
      assert(collection.items['a.txt'].path === 'a.txt');
    });

    it('should load an object of items from an event', function() {
      var collection = new Collection();

      collection.on('addItems', function(items) {
        for (var key in items) {
          collection.addItem('foo/' + key, items[key]);
          delete items[key];
        }
      });

      collection.addItems({
        a: {path: 'a.txt'},
        b: {path: 'b.txt'},
        c: {path: 'c.txt'}
      });

      assert(collection.items.hasOwnProperty('foo/a'));
      assert(collection.items['foo/a'].path === 'a.txt');
    });

    it('should signal `loaded` when finished (addItems)', function() {
      var collection = new Collection();

      collection.on('addItems', function(items) {
        for (var key in items) {
          if (key === 'c') {
            collection.loaded = true;
            break;
          }
          collection.addItem('foo/' + key, items[key]);
        }
      });

      collection.addItems({
        a: {path: 'a.txt'},
        b: {path: 'b.txt'},
        c: {path: 'c.txt'}
      });

      assert(collection.items.hasOwnProperty('foo/a'));
      assert(!collection.items.hasOwnProperty('foo/c'));
      assert(collection.items['foo/a'].path === 'a.txt');
    });

    it('should signal `loaded` when finished (addList)', function() {
      var collection = new Collection();

      collection.on('addList', function(items) {
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item.key === 'c') {
            collection.loaded = true;
            break;
          }
          item.key = 'foo/' + item.key;
          collection.addItem(item.key, item);
        }
      });

      collection.addList([
        {key: 'a', path: 'a.txt'},
        {key: 'b', path: 'b.txt'},
        {key: 'c', path: 'c.txt'}
      ]);

      assert(collection.items.hasOwnProperty('foo/a'));
      assert(collection.items['foo/a'].path === 'a.txt');
      assert(!collection.items.hasOwnProperty('foo/c'));
    });
  });

  describe('getItem', function() {
    beforeEach(function() {
      collection = new Collection();
    });
    it('should get a item from `items`', function() {
      collection.addItem('one', {content: 'aaa'});
      collection.addItem('two', {content: 'zzz'});
      assert(isBuffer(collection.items.one.contents));
      assert(isBuffer(collection.getItem('one').contents));
      assert(collection.getItem('one').contents.toString() === 'aaa');
      assert(collection.getItem('two').contents.toString() === 'zzz');
    });
  });
});

describe('queue', function() {
  beforeEach(function() {
    collection = new Collection();
  });

  it('should emit arguments on addItem', function(done) {
    collection.on('addItem', function(args) {
      assert(args[0] === 'a');
      assert(args[1] === 'b');
      assert(args[2] === 'c');
      assert(args[3] === 'd');
      assert(args[4] === 'e');
      done();
    });

    collection.addItem('a', 'b', 'c', 'd', 'e');
  });

  it('should expose the `queue` property for loading items', function() {
    collection.queue.push(collection.item('b', {path: 'b'}));

    collection.addItem('a', {path: 'a'});
    assert(collection.items.hasOwnProperty('a'));
    assert(collection.items.hasOwnProperty('b'));
  });

  it('should load all items on the queue when addItem is called', function() {
    collection.on('addItem', function(args) {
      var len = args.length;
      var last = args[len - 1];
      if (typeof last === 'string') {
        args[len - 1] = { content: last };
      }
    });

    collection.addItem('a.html', 'aaa');
    collection.addItem('b.html', 'bbb');
    collection.addItem('c.html', 'ccc');

    assert(collection.items.hasOwnProperty('a.html'));
    assert(collection.getItem('a.html').content === 'aaa');
    assert(collection.items.hasOwnProperty('b.html'));
    assert(collection.getItem('b.html').content === 'bbb');
    assert(collection.items.hasOwnProperty('c.html'));
    assert(collection.getItem('c.html').content === 'ccc');
  });
});

describe('options', function() {
  describe('option', function() {
    beforeEach(function() {
      collection = new Collection();
    });

    it('should expose the `option` method', function() {
      collection.option('foo', 'bar');
      collection.options.should.have.property('foo', 'bar');
    });

    it('should be chainable', function() {
      collection.option('foo', 'bar')
        .addItems('a.hbs')
        .addItems('b.hbs')
        .addItems('c.hbs');

      collection.options.should.have.property('foo', 'bar');
      collection.items.should.have.properties([
        'a.hbs',
        'b.hbs',
        'c.hbs'
      ]);
    });

    it('should set a key/value pair on options', function() {
      collection.option('a', 'b');
      assert(collection.options.a === 'b');
    });

    it('should set an object on options', function() {
      collection.option({c: 'd'});
      assert(collection.options.c === 'd');
    });

    it('should get an option', function() {
      collection.option({c: 'd'});
      var c = collection.option('c');
      assert(c === 'd');
    });
  });

  describe('options.renameKey', function() {
    beforeEach(function() {
      collection = new Collection({
        renameKey: function(key) {
          return path.basename(key);
        }
      });
    });

    it('should use a custom rename key function on item keys', function() {
      collection.addItem('a/b/c/d.hbs', {content: 'foo bar baz'});
      assert(collection.items['d.hbs'].contents.toString() === 'foo bar baz');
    });

    it('should get a item with the renamed key', function() {
      collection.addItem('a/b/c/d.hbs', {content: 'foo bar baz'});
      assert(collection.getItem('d.hbs').contents.toString() === 'foo bar baz');
    });

    it('should get a item with the original key', function() {
      collection.addItem('a/b/c/d.hbs', {content: 'foo bar baz'});
      assert(collection.getItem('a/b/c/d.hbs').contents.toString() === 'foo bar baz');
    });
  });
});

