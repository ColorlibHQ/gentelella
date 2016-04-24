'use strict';

require('should');
var support = require('./support');
var App = support.resolve();
var app;

describe('handlers', function() {
  describe('custom handlers', function() {
    beforeEach(function() {
      app = new App();
      app.create('page');
    });

    it('should add custom middleware handlers:', function() {
      app.handler('foo');
      app.handler('bar');

      app.pages.use(function() {
        return function(view) {
          app.handle('foo', view);
          app.handle('bar', view);
        };
      });

      app.foo(/a/, function(view, next) {
        view.one = 'aaa';
        next();
      });

      app.bar(/z/, function(view, next) {
        view.two = 'zzz';
        next();
      });

      app.pages('a.txt', {content: 'aaa'});
      app.pages('z.txt', {content: 'zzz'});

      app.pages.getView('a.txt').should.have.property('one');
      app.pages.getView('a.txt').should.not.have.property('two');

      app.pages.getView('z.txt').should.not.have.property('one');
      app.pages.getView('z.txt').should.have.property('two');
    });
  });
});
