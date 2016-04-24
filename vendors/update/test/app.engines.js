'use strict';

require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('engine support', function() {
  beforeEach(function() {
    app = new App();
  });

  it('should throw an error when engine name is invalid:', function() {
    (function() {
      app.engine(null, {});
    }).should.throw('expected engine ext to be a string or array.');
  });

  it('should register an engine to the given extension', function() {
    app.engine('hbs', function() {});
    assert(typeof app.engines['.hbs'] === 'object');
  });

  it('should set an engine with the given extension', function() {
    var hbs = function() {};
    hbs.render = function() {};
    hbs.renderFile = function() {};
    app.engine('hbs', hbs);
    assert(app.engines['.hbs']);
    assert(app.engines['.hbs'].renderFile);
    assert(app.engines['.hbs'].render);
  });

  it('should get an engine:', function() {
    app.engine('hbs', function() {});
    var hbs = app.engine('hbs');
    assert(typeof hbs === 'object');
    assert(hbs.hasOwnProperty('render'));
    assert(hbs.hasOwnProperty('compile'));
  });

  it('should return undefined if no engine is found:', function() {
    var hbs = app.getEngine();
    assert.equal(typeof hbs, 'undefined');
  });

  it('should register multiple engines to the given extension', function() {
    app.engine(['hbs', 'md'], function() {});
    assert(typeof app.engines['.hbs'] === 'object');
    assert(typeof app.engines['.md'] === 'object');
  });
});

describe('engines', function() {
  beforeEach(function() {
    app = new App();
    app.create('pages');
    app.pages('foo.tmpl', {content: 'A <%= letter %> {{= letter }} C'});
    app.pages('bar.tmpl', {content: 'A <%= letter %> {{ letter }} C'});
  });

  it('should register an engine:', function() {
    app.engine('a', {render: function() {}});
    app.engines.should.have.property('.a');
  });

  it('should use custom delimiters:', function(cb) {
    app.engine('tmpl', require('engine-base'), {
      delims: ['{{', '}}']
    });
    app.render('foo.tmpl', {letter: 'B'}, function(err, res) {
      if (err) return cb(err);
      res.contents.toString().should.equal('A <%= letter %> B C');
      cb();
    });
  });

  it('should override individual delims values:', function(cb) {
    app.engine('tmpl', require('engine-base'), {
      interpolate: /\{{([^}]+)}}/g,
      evaluate: /\{{([^}]+)}}/g,
      escape: /\{{-([^}]+)}}/g
    });
    app.render('bar.tmpl', {letter: 'B'}, function(err, res) {
      if (err) return cb(err);
      res.contents.toString().should.equal('A <%= letter %> B C');
      cb();
    });
  });

  it('should get an engine:', function() {
    app.engine('a', {
      render: function() {}
    });
    var a = app.engine('a');
    a.should.have.property('render');
  });
});

describe('engine selection:', function() {
  beforeEach(function(cb) {
    app = new App();
    app.engine('tmpl', require('engine-base'));
    app.engine('hbs', require('engine-handlebars'));
    app.create('pages');
    cb();
  });

  it('should get the engine from file extension:', function(cb) {
    app.page('a.tmpl', {content: '<%= a %>', locals: {a: 'b'}})
      .render(function(err, view) {
        if (err) return cb(err);
        assert(view.content === 'b');
        cb();
      });
  });

  it('should use the engine defined on the collection:', function(cb) {
    app.create('posts', {engine: 'hbs'});

    app.post('a', {content: '{{a}}', locals: {a: 'b'}})
      .render(function(err, view) {
        if (err) return cb(err);
        assert(view.content === 'b');
        cb();
      });
  });

  it('should use the engine defined on the view:', function(cb) {
    app.create('posts');
    app.post('a', {content: '{{a}}', engine: 'hbs', locals: {a: 'b'}})
      .render(function(err, view) {
        if (err) return cb(err);
        assert(view.content === 'b');
        cb();
      });
  });

  it('should use the engine defined on `view.data`:', function(cb) {
    app.create('posts');
    app.post('a', {content: '{{a}}', locals: {a: 'b'}, data: {engine: 'hbs'}})
      .render(function(err, view) {
        if (err) return cb(err);
        assert(view.content === 'b');
        cb();
      });
  });

  it('should use the engine defined on render locals:', function(cb) {
    app.create('posts');
    app.post('a', {content: '{{a}}', locals: {a: 'b'}})
      .render({engine: 'hbs'}, function(err, view) {
        if (err) return cb(err);
        assert(view.content === 'b');
        cb();
      });
  });
});
