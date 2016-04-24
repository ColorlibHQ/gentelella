require('mocha');
require('should');
var async = require('async');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var List = App.List;
var pages;

describe('render', function() {
  describe('rendering', function() {
    beforeEach(function() {
      pages = new List();
      pages.engine('tmpl', require('engine-base'));
    });

    it('should throw an error when no callback is given:', function() {
      (function() {
        pages.render({});
      }).should.throw('List#render is async and expects a callback function');
    });

    it('should throw an error when an engine is not defined:', function(done) {
      pages.addItem('foo.bar', {content: '<%= name %>'});
      var page = pages.getItem('foo.bar');

      pages.render(page, function(err) {
        assert(err.message === 'List#render cannot find an engine for: .bar');
        done();
      });
    });

    it('should use helpers to render a item:', function(done) {
      var locals = {name: 'Halle'};

      pages.helper('upper', function(str) {
        return str.toUpperCase(str);
      });

      pages.addItem('a.tmpl', {content: 'a <%= upper(name) %> b', locals: locals});
      var page = pages.getItem('a.tmpl');

      pages.render(page, function(err, res) {
        if (err) return done(err);

        assert(res.content === 'a HALLE b');
        done();
      });
    });

    it('should use helpers when rendering a item:', function(done) {
      var locals = {name: 'Halle'};
      pages.helper('upper', function(str) {
        return str.toUpperCase(str);
      });

      pages.addItem('a.tmpl', {content: 'a <%= upper(name) %> b', locals: locals});
      var page = pages.getItem('a.tmpl');

      pages.render(page, function(err, res) {
        if (err) return done(err);
        assert(res.content === 'a HALLE b');
        done();
      });
    });

    it('should render a template when contents is a buffer:', function(done) {
      pages.addItem('a.tmpl', {content: '<%= a %>', locals: {a: 'b'}});
      var item = pages.getItem('a.tmpl');

      pages.render(item, function(err, item) {
        if (err) return done(err);
        assert(item.contents.toString() === 'b');
        done();
      });
    });

    it('should render a template when content is a string:', function(done) {
      pages.addItem('a.tmpl', {content: '<%= a %>', locals: {a: 'b'}});
      var item = pages.getItem('a.tmpl');

      pages.render(item, function(err, item) {
        if (err) return done(err);
        assert(item.contents.toString() === 'b');
        done();
      });
    });

    it('should render a item from its path:', function(done) {
      pages.addItem('a.tmpl', {content: '<%= a %>', locals: {a: 'b'}});

      pages.render('a.tmpl', function(err, item) {
        if (err) return done(err);
        assert(item.content === 'b');
        done();
      });
    });

    it('should use a plugin for rendering:', function(done) {
      pages.engine('tmpl', require('engine-base'));
      pages.option('engine', 'tmpl');

      pages.addItems({
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
