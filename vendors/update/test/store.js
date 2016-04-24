'use strict';

require('mocha');
require('should');
var fs = require('fs');
var path = require('path');
var Store = require('data-store');
var assert = require('assert');
var App = require('../');
var app;

describe('store', function() {
  beforeEach(function() {
    app = new App();
  });

  afterEach(function(cb) {
    app.store.del({force: true});
    app.store.data = {};
    cb();
  });

  it('should create a store at the given `cwd`', function() {
    app = new App({store: {cwd: __dirname + '/actual'}});
    app.store.set('foo', 'bar');
    assert(path.basename(app.store.path) === 'update.json');
    assert(app.store.data.hasOwnProperty('foo'));
    assert(app.store.data.foo === 'bar');
    assert(fs.existsSync(path.join(__dirname, 'actual', 'update.json')));
  });

  it('should create a store using the given `indent` value', function() {
    app = new App({store: {cwd: __dirname + '/actual', indent: 0}});
    app.store.set('foo', 'bar');
    var contents = fs.readFileSync(path.join(__dirname, 'actual', 'update.json'), 'utf8');
    assert(contents === '{"foo":"bar"}');
  });

  it('should set a value on the store', function() {
    app.store.set('one', 'two');
    app.store.data.one.should.equal('two');
  });

  it('should set an object', function() {
    app.store.set({four: 'five', six: 'seven'});
    app.store.data.four.should.equal('five');
    app.store.data.six.should.equal('seven');
  });

  it('should set a nested value', function() {
    app.store.set('a.b.c.d', {e: 'f'});
    app.store.data.a.b.c.d.e.should.equal('f');
  });

  it('should union a value onto an array on the store', function() {
    app.store.union('one', 'two');
    app.store.data.one.should.eql(['two']);
  });

  it('should not union duplicate values', function() {
    app.store.union('one', 'two');
    app.store.data.one.should.eql(['two']);

    app.store.union('one', ['two']);
    app.store.data.one.should.eql(['two']);
  });

  it('should concat an existing array:', function() {
    app.store.union('one', 'a');
    app.store.data.one.should.eql(['a']);

    app.store.union('one', ['b']);
    app.store.data.one.should.eql(['a', 'b']);

    app.store.union('one', ['c', 'd']);
    app.store.data.one.should.eql(['a', 'b', 'c', 'd']);
  });

  it('should return true if a key exists on the store', function() {
    app.store.set('foo', 'bar');
    assert(app.store.has('foo'));
  });

  it('should return true when the value is null', function() {
    app.store.set('baz', null);
    assert(app.store.has('baz'));
  });

  it('should return false when the value is undefined', function() {
    app.store.set('qux', undefined);
    assert(!app.store.has('qux'));
  });

  it('should return true if a nested key exists on the store', function() {
    app.store.set('a.b.c.d', {x: 'zzz'});
    app.store.set('a.b.c.e', {f: null});
    app.store.set('a.b.g.j', {k: undefined});

    assert(!app.store.has('a.b.bar'));
    assert(app.store.has('a.b.c.d'));
    assert(app.store.has('a.b.c.d.x'));
    assert(!app.store.has('a.b.c.d.z'));
    assert(app.store.has('a.b.c.e'));
    assert(app.store.has('a.b.c.e.f'));
    assert(!app.store.has('a.b.c.e.z'));
    assert(app.store.has('a.b.g.j'));
    assert(!app.store.has('a.b.g.j.k'));
    assert(!app.store.has('a.b.g.j.z'));
  });

   it('should return true if a key exists `.hasOwn()` on the store', function() {
    app.store.set('foo', 'bar');
    app.store.set('baz', null);
    app.store.set('qux', undefined);

    assert(app.store.hasOwn('foo'));
    assert(!app.store.hasOwn('bar'));
    assert(app.store.hasOwn('baz'));
    assert(app.store.hasOwn('qux'));
  });

  it('should return true if a nested key exists `.hasOwn()` on the store', function() {
    app.store.set('a.b.c.d', {x: 'zzz'});
    app.store.set('a.b.c.e', {f: null});
    app.store.set('a.b.g.j', {k: undefined});

    assert(app.store.hasOwn('a.b.c.d'));
    assert(app.store.hasOwn('a.b.c.d.x'));
    assert(app.store.has('a.b.c.e.f'));
    assert(app.store.hasOwn('a.b.c.e.f'));
    assert(app.store.hasOwn('a.b.g.j.k'));

    assert(!app.store.hasOwn('a.b.bar'));
    assert(!app.store.hasOwn('a.b.c.d.z'));
    assert(!app.store.hasOwn('a.b.c.e.bar'));
    assert(!app.store.has('a.b.g.j.k'));
    assert(!app.store.hasOwn('a.b.g.j.foo'));
  });

  it('should `.get()` a stored value', function() {
    app.store.set('three', 'four');
    app.store.get('three').should.equal('four');
  });

  it('should `.get()` a nested value', function() {
    app.store.set({a: {b: {c: 'd'}}});
    app.store.get('a.b.c').should.equal('d');
  });

  it('should `.del()` a stored value', function() {
    app.store.set('a', 'b');
    app.store.set('c', 'd');
    app.store.del('a');
    assert(!app.store.hasOwnProperty('a'));
  });

  it('should `.del()` multiple stored values', function() {
    app.store.set('a', 'b');
    app.store.set('c', 'd');
    app.store.set('e', 'f');
    app.store.del(['a', 'c', 'e']);
    app.store.data.should.eql({});
  });
});

describe('events', function() {
  beforeEach(function() {
    app = new App();
    app.store = new Store('update-tests');
  });

  afterEach(function(cb) {
    app.store.del({force: true});
    cb();
  });

  it('should emit `set` when an object is set:', function() {
    var keys = [];
    app.store.on('set', function(key) {
      keys.push(key);
    });

    app.store.set({a: {b: {c: 'd'}}});
    assert(keys[0] === 'a');
  });

  it('should emit `set` when a key/value pair is set:', function() {
    var keys = [];
    app.store.on('set', function(key) {
      keys.push(key);
    });

    app.store.set('a', 'b');
    assert(keys[0] === 'a');
  });

  it('should emit `set` when an object value is set:', function() {
    var keys = [];
    app.store.on('set', function(key) {
      keys.push(key);
    });

    app.store.set('a', {b: 'c'});
    assert(keys[0] === 'a');
  });

  it('should emit `set` when an array of objects is passed:', function() {
    var keys = [];
    app.store.on('set', function(key) {
      keys.push(key);
    });

    app.store.set([{a: 'b'}, {c: 'd'}]);
    assert(keys[0] === 'a');
    assert(keys[1] === 'c');
  });

  it('should emit `del` when a value is deleted:', function(cb) {
    app.store.on('del', function(key) {
      assert(key === 'a');
      cb();
    });

    app.store.set('a', {b: 'c'});
    app.store.get('a').should.eql({b: 'c'});
    app.store.del('a');
  });

  it('should emit deleted keys on `del`:', function(cb) {
    app.store.once('del', function(key) {
      console.log(key)
      assert(key === 'a');
      cb();
    });

    app.store.set('a', 'b');
    app.store.set('c', 'd');
    app.store.set('e', 'f');
    assert.deepEqual(Object.keys(app.store.data), ['a', 'c', 'e']);
    app.store.del({force: true});
    assert.deepEqual(Object.keys(app.store.data), []);
  });
});
