require('mocha');
require('should');
var path = require('path');
var get = require('get-value');
var assert = require('assert');
var typeOf = require('kind-of');
var support = require('./support/');
var isBuffer = require('is-buffer');
assert.containEql = support.containEql;
var App = support.resolve();
var List = App.List;
var Views = App.Views;
var list, views;

describe('list', function() {
  describe('constructor', function() {
    it('should create an instance of List', function() {
      var list = new List();
      assert(list instanceof List);
    });

    it('should instaniate without `new`', function() {
      var list = List();
      assert(list instanceof List);
    });
  });

  describe('static methods', function() {
    it('should expose `extend`', function() {
      assert(typeof List.extend === 'function');
    });
  });

  describe('prototype methods', function() {
    beforeEach(function() {
      list = new List();
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
      it('should expose the ' + method + ' method', function() {
        assert(typeof list[method] === 'function');
      });
    });

    it('should expose the isList property', function() {
      assert(typeof list.isList === 'boolean');
    });

    it('should expose the keys property', function() {
      assert(Array.isArray(list.keys));
    });

    it('should expose the queue property', function() {
      assert(Array.isArray(list.queue));
    });

    it('should expose the items property', function() {
      assert(Array.isArray(list.items));
    });

    it('should expose the options property', function() {
      assert(typeOf(list.options) === 'object');
    });
  });

  describe('instance', function() {
    beforeEach(function() {
      list = new List();
    });

    it('should set a value on the instance', function() {
      list.set('a', 'b');
      assert(list.a === 'b');
    });

    it('should get a value from the instance', function() {
      list.set('a', 'b');
      assert(list.get('a') === 'b');
    });
  });

  describe('use', function() {
    beforeEach(function() {
      list = new List();
    });

    it('should expose the instance to plugins', function() {
      list
        .use(function(inst) {
          inst.foo = 'bar';
        });

      assert(list.foo === 'bar');
    });

    it('should expose `item` when the plugin returns a function', function() {
      list
        .use(function() {
          return function(item) {
            item.foo = 'bar';
          };
        });

      list.addItem('aaa');
      list.addItem('bbb');
      list.addItem('ccc');

      assert(list.items[0].foo === 'bar');
      assert(list.items[1].foo === 'bar');
      assert(list.items[2].foo === 'bar');
    });
  });

  describe('addItem', function() {
    beforeEach(function() {
      list = new List();
    });

    it('should add items to a list', function() {
      list.addItem('a', {content: '...'});
      list.addItem('b', {content: '...'});
      list.addItem('c', {content: '...'});
      assert(list.items.length === 3);
    });
  });

  describe('removeItem', function() {
    beforeEach(function() {
      list = new List();
    });

    it('should remove an item from `items`', function() {
      list.addItem('a', {content: '...'});
      list.addItem('b', {content: '...'});
      list.addItem('c', {content: '...'});
      assert(list.items.length === 3);
      var a = list.getItem('a');
      list.removeItem(a);
      assert(list.items.length === 2);
      var c = list.getItem(c);
      list.removeItem(c);
      assert(list.items[0].key === 'b');
    });

    it('should remove an item from `items` by key', function() {
      list.addItem('a', {content: '...'});
      list.addItem('b', {content: '...'});
      list.addItem('c', {content: '...'});
      assert(list.items.length === 3);
      list.removeItem('c');
      assert(list.items.length === 2);
      list.removeItem('b');
      assert(list.items[0].key === 'a');
    });
  });

  describe('addItems', function() {
    beforeEach(function() {
      list = new List();
    });

    it('should add an object with multiple items', function() {
      list.addItems({
        one: {content: 'foo'},
        two: {content: 'bar'}
      });
      assert(isBuffer(list.items[0].contents));
      assert(isBuffer(list.items[1].contents));
    });

    it('should signal `loaded` when finished (addItems)', function() {
      list.on('addItems', function(items) {
        for (var key in items) {
          if (key === 'c') {
            list.loaded = true;
            break;
          }
          list.addItem('foo/' + key, items[key]);
        }
      });

      list.addItems({
        a: {path: 'a.txt'},
        b: {path: 'b.txt'},
        c: {path: 'c.txt'}
      });

      assert.equal(list.items.length, 2);
      assert.equal(list.items[0].key, 'foo/a');
      assert.equal(list.items[0].path, 'a.txt');
    });
  });

  describe('addList', function() {
    beforeEach(function() {
      list = new List();
    });

    it('should add an array with multiple items', function() {
      list.addList([
        {path: 'one', content: 'foo'},
        {path: 'two', content: 'bar'}
      ]);
      assert(isBuffer(list.items[0].contents));
      assert(isBuffer(list.items[1].contents));
    });

    it('should take a callback on `addList`', function() {
      function addContents(item) {
        item.contents = new Buffer(item.path.charAt(0));
      }

      list.addList([
        { path: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
        { path: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
        { path: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } }
      ], addContents);

      assert(isBuffer(list.items[0].contents));
      assert(isBuffer(list.items[1].contents));
      assert(isBuffer(list.items[2].contents));
    });

    it('should throw an error when the list is not an array', function() {
      function addContents(item) {
        item.contents = new Buffer(item.path.charAt(0));
      }

      (function() {
        list.addList({
          'a.md': {locals: { date: '2014-01-01', foo: 'zzz', bar: 1 }},
          'f.md': {locals: { date: '2014-01-01', foo: 'mmm', bar: 2 }},
          'd.md': {locals: { date: '2014-01-01', foo: 'xxx', bar: 3 }}
        }, addContents);

        assert(isBuffer(list.items[0].contents));
        assert(isBuffer(list.items[1].contents));
        assert(isBuffer(list.items[2].contents));
      }).should.throw('expected list to be an array.');
    });

    it('should signal `loaded` when finished (addList)', function() {
      list.on('addList', function(items) {
        var len = items.length;
        var i = -1;

        while (++i < len) {
          if (items[i].path === 'd.md') {
            list.loaded = true;
            break;
          }
          list.addItem('foo/' + items[i].path, items[i]);
        }
      });

      list.addList([
        { path: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
        { path: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
        { path: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } }
      ]);

      assert.equal(list.items.length, 2);
      assert.equal(list.keys.indexOf('d.md'), -1);
    });
  });

  describe('queue', function() {
    beforeEach(function() {
      list = new List();
    });

    it('should emit arguments on addItem', function(done) {
      list.on('addItem', function(args) {
        assert(args[0] === 'a');
        assert(args[1] === 'b');
        assert(args[2] === 'c');
        assert(args[3] === 'd');
        assert(args[4] === 'e');
        done();
      });

      list.addItem('a', 'b', 'c', 'd', 'e');
    });

    it('should expose the `queue` property for loading items', function() {
      list.queue.push(list.item('b', {path: 'b'}));

      list.addItem('a', {path: 'a'});
      assert(list.items[0].key === 'a');
      assert(list.items[1].key === 'b');
    });

    it('should load all items on the queue when addItem is called', function() {
      list.on('addItem', function(args) {
        var len = args.length;
        var last = args[len - 1];
        if (typeof last === 'string') {
          args[len - 1] = { content: last };
        }
      });

      list.addItem('a.html', 'aaa');
      list.addItem('b.html', 'bbb');
      list.addItem('c.html', 'ccc');

      assert(list.items[0].path === 'a.html');
      assert(list.getItem('a.html').content === 'aaa');
      assert(list.items[1].path === 'b.html');
      assert(list.getItem('b.html').content === 'bbb');
      assert(list.items[2].path === 'c.html');
      assert(list.getItem('c.html').content === 'ccc');
    });
  });

  describe('sortBy', function() {
    var items = [
      { path: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
      { path: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
      { path: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
      { path: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
      { path: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
      { path: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
      { path: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
      { path: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
      { path: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
      { path: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } },
      { path: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
      { path: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } },
      { path: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } }
    ];

    it('should sort a list', function() {
      list = new List();
      list.addList(items);

      var compare = function(prop) {
        return function(a, b, fn) {
          var valA = get(a, prop);
          var valB = get(b, prop);
          return fn(valA, valB);
        };
      };

      var res = list.sortBy('locals.date', 'doesnt.exist', [
        compare('locals.foo'),
        compare('locals.bar')
      ]);

      assert.containEql(res.items, [
        { key: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } },
        { key: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
        { key: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
        { key: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
        { key: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
        { key: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
        { key: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
        { key: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
        { key: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
        { key: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } },
        { key: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
        { key: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
        { key: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } }
      ]);
    });

    it('should not sort the (original) instance list `items`', function() {
      list = new List();
      list.addList(items);

      var compare = function(prop) {
        return function(a, b, fn) {
          var valA = get(a, prop);
          var valB = get(b, prop);
          return fn(valA, valB);
        };
      };

      var res = list.sortBy('locals.date', 'doesnt.exist', [
        compare('locals.foo'),
        compare('locals.bar')
      ]);

      // should not be sorted
      assert.containEql(list.items, items);

      // should be sorted
      assert.containEql(res.items, [
        { key: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } },
        { key: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
        { key: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
        { key: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
        { key: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
        { key: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
        { key: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
        { key: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
        { key: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
        { key: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } },
        { key: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
        { key: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
        { key: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } }
      ]);
    });

    it('should pass options to array-sort from the constructor', function() {
      list = new List({sort: {reverse: true}});
      list.addList(items);

      var compare = function(prop) {
        return function(a, b, fn) {
          var valA = get(a, prop);
          var valB = get(b, prop);
          return fn(valA, valB);
        };
      };

      var res = list.sortBy('locals.date', 'doesnt.exist', [
        compare('locals.foo'),
        compare('locals.bar')
      ]);

      assert.containEql(res.items, [
        { key: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } },
        { key: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
        { key: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
        { key: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } },
        { key: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
        { key: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
        { key: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
        { key: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
        { key: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
        { key: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
        { key: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
        { key: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
        { key: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } }
      ]);
    });

    it('should pass options to array-sort from the sortBy method', function() {
      list = new List();
      list.addList(items);

      var compare = function(prop) {
        return function(a, b, fn) {
          var valA = get(a, prop);
          var valB = get(b, prop);
          return fn(valA, valB);
        };
      };

      var res = list.sortBy('locals.date', 'doesnt.exist', [
        compare('locals.foo'),
        compare('locals.bar')
      ], {reverse: true});

      assert.containEql(res.items, [
        { key: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } },
        { key: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
        { key: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
        { key: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } },
        { key: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
        { key: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
        { key: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
        { key: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
        { key: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
        { key: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
        { key: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
        { key: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
        { key: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } }
      ]);
    });
  });

  describe('groupBy', function() {
    var items = [
      { path: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
      { path: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
      { path: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
      { path: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
      { path: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
      { path: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
      { path: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
      { path: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
      { path: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
      { path: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } },
      { path: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
      { path: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } },
      { path: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } }
    ];

    it('should group a list by a property', function() {
      list = new List();
      list.addList(items);

      var res = list.groupBy('locals.foo');
      var keys = ['zzz', 'mmm', 'xxx', 'aaa', 'ccc', 'rrr', 'ttt', 'yyy'];
      assert.deepEqual(Object.keys(res), keys);
    });
  });

  describe('sort and group', function() {
    var items = [
      { path: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
      { path: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
      { path: 'd.md', locals: { date: '2013-01-01', foo: 'xxx', bar: 3 } },
      { path: 'i.md', locals: { date: '2013-02-01', foo: 'xxx', bar: 5 } },
      { path: 'i.md', locals: { date: '2013-02-01', foo: 'lll', bar: 5 } },
      { path: 'k.md', locals: { date: '2013-03-01', foo: 'xxx', bar: 1 } },
      { path: 'j.md', locals: { date: '2013-02-01', foo: 'xxx', bar: 4 } },
      { path: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
      { path: 'm.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
      { path: 'n.md', locals: { date: '2013-01-01', foo: 'xxx', bar: 7 } },
      { path: 'o.md', locals: { date: '2013-01-01', foo: 'xxx', bar: 7 } },
      { path: 'p.md', locals: { date: '2013-01-01', foo: 'xxx', bar: 7 } },
      { path: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
      { path: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } },
      { path: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
      { path: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } },
      { path: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } }
    ];

    it('should group a list by a property', function() {
      list = new List(items);

      var context = list
        .sortBy('locals.date')
        .groupBy(function(view) {
          var date = view.locals.date;
          view.locals.year = date.slice(0, 4);
          view.locals.month = date.slice(5, 7);
          view.locals.day = date.slice(8, 10);
          return view.locals.year;
        }, 'locals.month');

      var keys = Object.keys(context);
      assert(keys[0] === '2012');
      assert(keys[1] === '2013');
      assert(keys[2] === '2014');
      assert(keys[3] === '2015');
    });
  });

  describe('paginate', function() {
    var items = [
      { path: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
      { path: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
      { path: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
      { path: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
      { path: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
      { path: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
      { path: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
      { path: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
      { path: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
      { path: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } },
      { path: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
      { path: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } },
      { path: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } }
    ];

    it('should paginate a list', function() {
      list = new List(items);

      var res = list.paginate();
      assert.equal(res.length, 2);
      assert.containEql(res[0].items, items.slice(0, 10));
      assert.containEql(res[1].items, items.slice(10));
    });

    it('should add pager properties', function() {
      list = new List({pager: true});
      list.addList(items);
      list.items.forEach(function(item, i) {
        assert.equal(item.data.pager.index, i);
      });
    });

    it('should paginate a list with given options', function() {
      list = new List(items);
      var res = list.paginate({limit: 5});

      assert.equal(res.length, 3);
      assert.containEql(res[0].items, items.slice(0, 5));
      assert.containEql(res[1].items, items.slice(5, 10));
      assert.containEql(res[2].items, items.slice(10));
    });
  });

  describe('Views instance', function() {
    beforeEach(function() {
      views = new Views();
    });

    it('should add views from an instance of Views', function() {
      views.addViews({
        one: {content: 'foo'},
        two: {content: 'bar'}
      });

      list = new List(views);
      assert(isBuffer(list.items[0].contents));
      assert(isBuffer(list.items[1].contents));
    });
  });

  describe('getIndex', function() {
    beforeEach(function() {
      list = new List();
    });
    it('should get the index of a key when key is not renamed', function() {
      list.addItem('a/b/c/ddd.hbs', {content: 'ddd'});
      list.addItem('a/b/c/eee.hbs', {content: 'eee'});
      assert(list.getIndex('a/b/c/ddd.hbs') === 0);
      assert(list.getIndex('a/b/c/eee.hbs') === 1);
    });

    it('should get the index of a key when key is renamed', function() {
      list = new List({
        renameKey: function(key) {
          return path.basename(key);
        }
      });
      list.addItem('a/b/c/ddd.hbs', {content: 'ddd'});
      list.addItem('a/b/c/eee.hbs', {content: 'eee'});
      assert(list.getIndex('a/b/c/ddd.hbs') === 0);
      assert(list.getIndex('ddd.hbs') === 0);
      assert(list.getIndex('a/b/c/eee.hbs') === 1);
      assert(list.getIndex('eee.hbs') === 1);
    });
  });

  describe('getItem', function() {
    beforeEach(function() {
      list = new List();
    });

    it('should get an view from `views`', function() {
      list.addItem('one', {content: 'aaa'});
      list.addItem('two', {content: 'zzz'});
      assert(list.items.length === 2);
      assert(isBuffer(list.items[0].contents));
      assert(isBuffer(list.getItem('one').contents));
      assert(list.getItem('one').contents.toString() === 'aaa');
      assert(list.getItem('two').contents.toString() === 'zzz');
    });
  });

  describe('use', function() {
    beforeEach(function() {
      list = new List();
    });

    it('should use middleware on a list', function() {
      list.addItem('one', {content: 'aaa'});
      list.addItem('two', {content: 'zzz'});

      list
        .use(function() {
          this.set('foo', 'bar');
        })
        .use(function() {
          this.set('one', 'two');
        });

      assert(list.one === 'two');
      assert(list.foo === 'bar');
    });
  });
});

