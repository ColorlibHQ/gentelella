require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('layouts', function() {
  beforeEach(function() {
    app = new App();
    app.engine('tmpl', require('engine-base'));
    app.create('layout', { viewType: 'layout' });
    app.create('page');
  });

  it('should apply a layout to a view:', function(done) {
    app.layout('base', {path: 'base.tmpl', content: 'a {% body %} c'});
    app.pages('a.tmpl', {path: 'a.tmpl', content: 'b', layout: 'base'});
    var page = app.pages.getView('a.tmpl');

    app.render(page, function(err, view) {
      if (err) return done(err);
      assert.equal(typeof view.content, 'string');
      assert.equal(view.content, 'a b c');
      done();
    });
  });

  it('should not apply a layout when `layoutApplied` is set:', function(done) {
    app.layout('base', {path: 'base.tmpl', content: 'a {% body %} c'});
    app.pages('a.tmpl', {path: 'a.tmpl', content: 'b', layout: 'base'});
    var page = app.pages.getView('a.tmpl');
    page.option('layoutApplied', true);

    app.render(page, function(err, view) {
      if (err) return done(err);
      assert.equal(typeof view.content, 'string');
      assert.equal(view.content, 'b');
      done();
    });
  });

  it('should not apply a layout to itself:', function(done) {
    app.layout('base', {path: 'base.tmpl', content: 'a {% body %} c', layout: 'base'});
    app.pages('a.tmpl', {path: 'a.tmpl', content: 'b', layout: 'base'});
    var page = app.pages.getView('a.tmpl');

    app.render(page, function(err, view) {
      if (err) return done(err);
      assert.equal(typeof view.content, 'string');
      assert.equal(view.content, 'a b c');
      done();
    });
  });

  it('should apply nested layouts to a view:', function(done) {
    app.layout('a', {path: 'a.tmpl', content: 'a {% body %} a', layout: 'b'});
    app.layout('b', {path: 'b.tmpl', content: 'b {% body %} b', layout: 'c'});
    app.layout('c', {path: 'c.tmpl', content: 'c {% body %} c', layout: 'base'});
    app.layout('base', {path: 'base.tmpl', content: 'outter {% body %} outter'});

    app.pages('z.tmpl', {path: 'a.tmpl', content: 'inner', layout: 'a'});
    var page = app.pages.getView('z.tmpl');

    app.render(page, function(err, view) {
      if (err) return done(err);
      assert.equal(typeof view.content, 'string');
      assert.equal(view.content, 'outter c b a inner a b c outter');
      done();
    });
  });

  it('should track layout stack history on `layoutStack`:', function(done) {
    app.layout('a', {path: 'a.tmpl', content: 'a {% body %} a', layout: 'b'});
    app.layout('b', {path: 'b.tmpl', content: 'b {% body %} b', layout: 'c'});
    app.layout('c', {path: 'c.tmpl', content: 'c {% body %} c', layout: 'base'});
    app.layout('base', {path: 'base.tmpl', content: 'outter {% body %} outter'});

    app.pages('z.tmpl', {path: 'a.tmpl', content: 'inner', layout: 'a'});
    var page = app.pages.getView('z.tmpl');

    app.render(page, function(err, view) {
      if (err) return done(err);
      assert(view.layoutStack.length === 4);
      assert(typeof view.layoutStack[0] === 'object');
      assert(typeof view.layoutStack[0].depth === 'number');
      done();
    });
  });

  it('should track layout stack history on `layoutStack`:', function(done) {
    app.layout('a', {path: 'a.tmpl', content: 'a {% body %} a', layout: 'b'});
    app.layout('b', {path: 'b.tmpl', content: 'b {% body %} b', layout: 'c'});
    app.layout('c', {path: 'c.tmpl', content: 'c {% body %} c', layout: 'base'});
    app.layout('base', {path: 'base.tmpl', content: 'outter {% body %} outter'});

    app.pages('z.tmpl', {path: 'a.tmpl', content: 'inner', layout: 'a'});
    var page = app.pages.getView('z.tmpl');

    app.render(page, function(err, view) {
      if (err) return done(err);
      assert.equal(typeof view.content, 'string');
      assert.equal(view.content, 'outter c b a inner a b c outter');
      done();
    });
  });

  it('should get layouts from `layout` viewTypes:', function(done) {
    app.create('section', { viewType: 'layout' });
    app.create('block', { viewType: 'layout' });

    app.section('a', {path: 'a.tmpl', content: 'a {% body %} a', layout: 'b'});
    app.block('b', {path: 'b.tmpl', content: 'b {% body %} b', layout: 'c'});
    app.section('c', {path: 'c.tmpl', content: 'c {% body %} c', layout: 'base'});
    app.block('base', {path: 'base.tmpl', content: 'outter {% body %} outter'});

    app.pages('z.tmpl', {path: 'a.tmpl', content: 'inner', layout: 'a'});
    var page = app.pages.getView('z.tmpl');

    app.render(page, function(err, view) {
      if (err) return done(err);
      assert.equal(typeof view.content, 'string');
      assert.equal(view.content, 'outter c b a inner a b c outter');
      done();
    });
  });
});
