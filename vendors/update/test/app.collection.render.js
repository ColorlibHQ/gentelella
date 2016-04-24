'use strict';

require('mocha');
require('should');
var async = require('async');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var List = App.List;
var pages, app;

describe('render', function() {
  describe('rendering', function() {
    beforeEach(function() {
      app = App();
      pages = app.create('pages');
      app.engine('tmpl', require('engine-base'));
      pages.engine('tmpl', require('engine-base'));
    });

    it('should throw an error when no callback is given:', function() {
      (function() {
        app.pages.render({});
      }).should.throw('Views#render is async and expects a callback function');
    });

    it('should throw an error when an engine is not defined:', function(done) {
      pages.addView('foo.bar', { content: '<%= name %>' });
      var page = pages.getView('foo.bar');

      app.pages.render(page, function(err) {
        assert(err.message === 'Views#render cannot find an engine for: .bar');
        done();
      });
    });

    it('should use helpers defined on app to render a view:', function(done) {
      var locals = {name: 'Halle'};
      app.helper('upper', function(str) {
        return str.toUpperCase(str) + 'app';
      });

      pages.addView('a.tmpl', {content: 'a <%= upper(name) %> b', locals: locals});
      var page = pages.getView('a.tmpl');

      app.render(page, function(err, res) {
        if (err) return done(err);

        assert(res.content === 'a HALLEapp b');
        done();
      });
    });

    it('should use helpers defined on app to render a view with collection.render:', function(done) {
      var locals = {name: 'Halle'};
      app.helper('upper', function(str) {
        return str.toUpperCase(str) + 'app';
      });

      pages.addView('a.tmpl', {content: 'a <%= upper(name) %> b', locals: locals});
      pages.helper('upper', app._.helpers.sync.upper);
      var page = pages.getView('a.tmpl');

      pages.render(page, function(err, res) {
        if (err) return done(err);

        assert(res.content === 'a HALLEapp b');
        done();
      });
    });

    it('should use helpers when rendering a view:', function(done) {
      var locals = {name: 'Halle'};
      pages.helper('upper', function(str) {
        return str.toUpperCase(str);
      });

      pages.addView('a.tmpl', {content: 'a <%= upper(name) %> b', locals: locals});
      var page = pages.getView('a.tmpl');

      pages.render(page, function(err, res) {
        if (err) return done(err);
        assert(res.content === 'a HALLE b');
        done();
      });
    });

    it('should render a template when contents is a buffer:', function(done) {
      pages.addView('a.tmpl', {content: '<%= a %>', locals: {a: 'b'}});
      var view = pages.getView('a.tmpl');

      pages.render(view, function(err, view) {
        if (err) return done(err);
        assert(view.contents.toString() === 'b');
        done();
      });
    });

    it('should render a template when content is a string:', function(done) {
      pages.addView('a.tmpl', {content: '<%= a %>', locals: {a: 'b'}});
      var view = pages.getView('a.tmpl');

      pages.render(view, function(err, view) {
        if (err) return done(err);
        assert(view.contents.toString() === 'b');
        done();
      });
    });

    it('should render a view from its path:', function(done) {
      pages.addView('a.tmpl', {content: '<%= a %>', locals: {a: 'b'}});

      pages.render('a.tmpl', function(err, view) {
        if (err) return done(err);
        assert(view.content === 'b');
        done();
      });
    });

    it('should use a plugin for rendering:', function(done) {
      pages.engine('tmpl', require('engine-base'));
      pages.option('engine', 'tmpl');

      pages.addViews({
        'a': {content: '<%= title %>', locals: {title: 'aaa'}},
        'b': {content: '<%= title %>', locals: {title: 'bbb'}},
        'c': {content: '<%= title %>', locals: {title: 'ccc'}},
        'd': {content: '<%= title %>', locals: {title: 'ddd'}},
        'e': {content: '<%= title %>', locals: {title: 'eee'}},
        'f': {content: '<%= title %>', locals: {title: 'fff'}},
        'g': {content: '<%= title %>', locals: {title: 'ggg'}},
        'h': {content: '<%= title %>', locals: {title: 'hhh'}},
        'i': {content: '<%= title %>', locals: {title: 'iii'}},
        'j': {content: '<%= title %>', locals: {title: 'jjj'}}
      });

      pages.use(function(collection) {
        collection.option('pager', false);

        collection.renderEach = function(cb) {
          var list = new List(collection);
          async.map(list.items, function(item, next) {
            collection.render(item, next);
          }, cb);
        };
      });

      pages.renderEach(function(err, items) {
        if (err) return done(err);
        assert(items[0].content === 'aaa');
        assert(items[9].content === 'jjj');
        assert(items.length === 10);
        done();
      });
    });
  });
});
