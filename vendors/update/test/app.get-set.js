require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('app.set()', function() {
  beforeEach(function() {
    app = new App();
  });

  it('should set a value', function() {
    app.set('a', 'b');
    app.get('a').should.equal('b');
  });

  it('should set properties on the instance.', function() {
    app.set('a', 'b');
    app.a.should.equal('b');
  });

  it('should allow an object to be set directly.', function() {
    app.set({x: 'y'});
    app.x.should.equal('y');
    app.get('x').should.equal('y');
  });

  it('should set nested properties on the instance.', function() {
    app.set('c', {d: 'e'});
    app.get('c').d.should.equal('e');
  });

  it('should use dot notation to `set` values.', function() {
    app.set('h.i', 'j');
    app.get('h').should.eql({i: 'j'});
  });

  it('should use dot notation to `get` values.', function() {
    app.set('h', {i: 'j'});
    app.get('h.i').should.equal('j');
  });

  it('should return `this` for chaining', function() {
    app.set('a', 'b').should.equal(app);
    app
      .set('aa', 'bb')
      .set('bb', 'cc')
      .set('cc', 'dd');
    app.get('aa').should.equal('bb');
    app.get('bb').should.equal('cc');
    app.get('cc').should.equal('dd');
  });

  it('should return undefined when not set', function() {
    app.set('a', undefined).should.equal(app);
  });
});

describe('app.get()', function() {
  beforeEach(function() {
    app = new App();
  });

  it('should return undefined when no set', function() {
    assert(app.get('a') === undefined);
  });

  it('should otherwise return the value', function() {
    app.set('a', 'b');
    app.get('a').should.equal('b');
  });
});
