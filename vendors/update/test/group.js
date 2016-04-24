'use strict';

require('mocha');
require('should');
var assert = require('assert');
var support = require('./support/');
assert.containEql = support.containEql;
var App = support.resolve();
var List = App.List;
var Group = App.Group;
var group;

describe('group', function() {
  describe('constructor', function() {
    it('should create an instance of Group:', function() {
      var group = new Group();
      assert(group instanceof Group);
    });

    it('should instantiate without new', function() {
      var group = Group();
      assert(group instanceof Group);
    });

    it('should create an instance of Group with default List:', function() {
      var group = new Group();
      assert.deepEqual(group.List, List);
    });

    it('should create an instance of Group with custom List:', function() {
      function CustomList() {
        List.apply(this, arguments);
      }
      List.extend(CustomList);
      var group = new Group({List: CustomList});
      assert.deepEqual(group.List, CustomList);
    });
  });

  describe('static methods', function() {
    it('should expose `extend`:', function() {
      assert(typeof Group.extend === 'function');
    });
  });

  describe('prototype methods', function() {
    beforeEach(function() {
      group = new Group();
    });

    it('should expose `use`', function() {
      assert(typeof group.use === 'function');
    });
    it('should expose `set`', function() {
      assert(typeof group.set === 'function');
    });
    it('should expose `get`', function() {
      assert(typeof group.get === 'function');
    });
    it('should expose `visit`', function() {
      assert(typeof group.visit === 'function');
    });
    it('should expose `define`', function() {
      assert(typeof group.define === 'function');
    });
  });

  describe('instance', function() {
    beforeEach(function() {
      group = new Group();
    });

    it('should expose options:', function() {
      assert(typeof group.options === 'object');
    });

    it('should set a value on the instance:', function() {
      group.set('a', 'b');
      assert(group.a === 'b');
    });

    it('should get a value from the instance:', function() {
      group.set('a', 'b');
      assert(group.get('a') === 'b');
    });
  });

  describe('get', function() {
    it('should get a normal value when not an array', function() {
      var group = new Group({'foo': {items: [1, 2, 3]}});
      assert.deepEqual(group.get('foo'), {items: [1, 2, 3]});
    });

    it('should get an instance of List when value is an array', function() {
      var group = new Group({'foo': {items: [{path: 'one.hbs'}, {path: 'two.hbs'}, {path: 'three.hbs'}]}});
      var list = group.get('foo.items');
      assert(list instanceof List);
      assert.deepEqual(list.items.length, 3);
    });

    it('should throw an error when trying to use a List method on a non List value', function() {
      (function() {
        var group = new Group({'foo': {items: [1, 2, 3]}});
        var foo = group.get('foo');
        foo.paginate();
      }).should.throw('paginate can only be used with an array of `List` items.');
    });

    it('should not override properties already existing on non List values', function(done) {
      var group = new Group({'foo': {items: [1, 2, 3], paginate: function() {
        assert(true);
        done();
      }}});
      var foo = group.get('foo');
      foo.paginate();
    });
  });

  describe('use', function() {
    beforeEach(function() {
      group = new Group();
    });

    it('should use middleware on a group:', function() {
      group.set('one', {contents: new Buffer('aaa')});
      group.set('two', {contents: new Buffer('zzz')});

      group
        .use(function(group) {
          group.options = {};
        })
        .use(function(group) {
          group.options.foo = 'bar';
        })
        .use(function() {
          this.set('one', 'two');
        });

      assert(group.one === 'two');
      assert(group.options.foo === 'bar');
    });
  });
});

