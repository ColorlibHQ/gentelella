require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('app.option', function() {
  beforeEach(function() {
    app = new App();
  });

  it('should set a key-value pair on options:', function() {
    app.option('a', 'b');
    assert(app.options.a === 'b');
  });

  it('should set an object on options:', function() {
    app.option({c: 'd'});
    assert(app.options.c === 'd');
  });

  it('should set an option.', function() {
    app.option('a', 'b');
    app.options.should.have.property('a');
  });

  it('should get an option.', function() {
    app.option('a', 'b');
    app.option('a').should.equal('b');
  });

  it('should extend the `options` object.', function() {
    app.option({x: 'xxx', y: 'yyy', z: 'zzz'});
    app.option('x').should.equal('xxx');
    app.option('y').should.equal('yyy');
    app.option('z').should.equal('zzz');
  });

  it('options should be on the `options` object.', function() {
    app.option({x: 'xxx', y: 'yyy', z: 'zzz'});
    app.options.x.should.equal('xxx');
    app.options.y.should.equal('yyy');
    app.options.z.should.equal('zzz');
  });

  it('should be chainable.', function() {
    app.option({x: 'xxx', y: 'yyy', z: 'zzz'});
    app.option({a: 'aaa', b: 'bbb', c: 'ccc'});

    app.option('x').should.equal('xxx');
    app.option('a').should.equal('aaa');
  });

  it('should extend the `options` object when the first param is a string.', function() {
    app.option('foo', {x: 'xxx', y: 'yyy', z: 'zzz'});
    app.option('bar', {a: 'aaa', b: 'bbb', c: 'ccc'});

    app.option('foo').should.have.property('x');
    app.option('bar').should.have.property('a');

    app.options.foo.should.have.property('x');
    app.options.bar.should.have.property('a');
  });

  it('should set an option.', function() {
    app.option('a', 'b');
    app.options.should.have.property('a');
  });

  it('should get an option.', function() {
    app.option('a', 'b');
    app.option('a').should.equal('b');
  });

  it('should extend the `options` object.', function() {
    app.option({x: 'xxx', y: 'yyy', z: 'zzz'});
    app.option('x').should.equal('xxx');
    app.option('y').should.equal('yyy');
    app.option('z').should.equal('zzz');
  });

  it('options should be on the `options` object.', function() {
    app.option({x: 'xxx', y: 'yyy', z: 'zzz'});
    app.options.x.should.equal('xxx');
    app.options.y.should.equal('yyy');
    app.options.z.should.equal('zzz');
  });

  it('should be chainable.', function() {
    app
      .option({x: 'xxx', y: 'yyy', z: 'zzz'})
      .option({a: 'aaa', b: 'bbb', c: 'ccc'});

    app.option('x').should.equal('xxx');
    app.option('a').should.equal('aaa');
  });
});
