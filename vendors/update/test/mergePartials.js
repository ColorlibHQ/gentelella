require('should');
var support = require('./support');
var App = support.resolve();
var app;

describe('mergePartials', function() {
  beforeEach(function() {
    app = new App();
  });

  it('should merge multiple partials collections onto one collection:', function() {
    var opts = { viewType: 'partial' };
    app.create('foo', opts);
    app.create('bar', opts);
    app.create('baz', opts);

    app.foo('a', {path: 'a', content: 'aaa'});
    app.bar('b', {path: 'b', content: 'bbb'});
    app.baz('c', {path: 'c', content: 'ccc'});

    var actual = app.mergePartials();
    actual.should.have.property('partials');
    actual.partials.should.have.properties(['a', 'b', 'c']);
  });

  it('should keep partials collections on separaet collections:', function() {
    var opts = { viewType: 'partial' };
    app.create('foo', opts);
    app.create('bar', opts);
    app.create('baz', opts);

    app.foo('a', {path: 'a', content: 'aaa'});
    app.bar('b', {path: 'b', content: 'bbb'});
    app.baz('c', {path: 'c', content: 'ccc'});

    var actual = app.mergePartials({mergePartials: false});
    actual.should.not.have.property('partials');
    actual.should.eql({ foos: { a: 'aaa' }, bars: { b: 'bbb' }, bazs: { c: 'ccc' } });
  });

  it('should emit `mergePartials`:', function() {
    var opts = { viewType: 'partial' };
    app.create('foo', opts);
    app.create('bar', opts);
    app.create('baz', opts);
    var arr = [];

    app.on('onMerge', function(view) {
      arr.push(view.content);
    });

    app.foo('a', {path: 'a', content: 'aaa'});
    app.bar('b', {path: 'b', content: 'bbb'});
    app.baz('c', {path: 'c', content: 'ccc'});

    var actual = app.mergePartials({mergePartials: false});
    actual.should.not.have.property('partials');
    actual.should.eql({ foos: { a: 'aaa' }, bars: { b: 'bbb' }, bazs: { c: 'ccc' } });
    arr.should.eql(['aaa', 'bbb', 'ccc']);
  });

  it('should handle `onMerge` middleware:', function() {
    var opts = { viewType: 'partial' };
    app.create('foo', opts);
    app.create('bar', opts);
    app.create('baz', opts);

    app.onMerge(/./, function(view, next) {
      view.content += ' onMerge';
      next();
    });

    app.foo('a', {path: 'a', content: 'aaa'});
    app.bar('b', {path: 'b', content: 'bbb'});
    app.baz('c', {path: 'c', content: 'ccc'});

    var actual = app.mergePartials({mergePartials: false});
    actual.should.eql({
      foos: {a: 'aaa onMerge'},
      bars: {b: 'bbb onMerge'},
      bazs: {c: 'ccc onMerge'}
    });
  });

  it('should skip views with `nomerge=true`:', function() {
    var opts = { viewType: 'partial' };

    app.create('foo', opts);
    app.create('bar', opts);
    app.create('baz', opts);

    app.onMerge(/[ab]/, function(view, next) {
      view.options.nomerge = true;
      next();
    });

    app.foo('a', {path: 'a', content: 'aaa'});
    app.bar('b', {path: 'b', content: 'bbb'});
    app.baz('c', {path: 'c', content: 'ccc'});

    var actual = app.mergePartials({mergePartials: false});
    actual.should.eql({ bazs: { c: 'ccc' } });
  });
});
