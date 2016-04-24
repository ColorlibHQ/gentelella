'use strict';

require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe.skip('render', function() {
  describe('engine', function() {
    var view;

    beforeEach(function() {
      app = new App({silent: true});
      app.engine('tmpl', require('engine-base'));
      app.create('page');
      view = {contents: new Buffer('a <%= name %> b'), locals: {name: 'Halle'}};
    });

    it('should render a view from an object:', function(done) {
      app.page('a.tmpl', view)
        .render(function(err, res) {
          if (err) return done(err);
          assert(res.contents.toString() === 'a Halle b');
          done();
        });
    });

    it('should throw an error when a variable is undefined:', function(done) {
      delete view.locals.name;

      app.page('a.tmpl', view)
        .render(function(err) {
          assert(err.message === 'name is not defined');
          done();
        });
    });

    it('should re-throw an error when rethrow is true:', function(done) {
      delete view.locals.name;

      app = new App({rethrow: true, silent: true});
      app.engine('tmpl', require('engine-base'));
      app.create('page');

      app.page('a.tmpl', view)
        .render(function(err) {
          assert(err.message === 'name is not defined');
          done();
        });
    });

    it('should emit a re-thrown error when rethrow is true:', function(done) {
      delete view.locals.name;

      app = new App({rethrow: true, silent: false});
      app.engine('tmpl', require('engine-base'));
      app.create('page');

      app.on('error', function(err) {
        assert(err.message === 'name is not defined');
        done();
      });

      app.page('a.tmpl', view)
        .render(function(err) {
          assert(err.message === 'name is not defined');
        });
    });
  });
});
