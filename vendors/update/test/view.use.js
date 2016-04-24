require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var View = App.View;
var view;

describe('view.use', function() {
  beforeEach(function() {
    view = new View();
  });

  it('should expose the instance to `use`:', function(done) {
    view.use(function(inst) {
      assert(inst instanceof View);
      done();
    });
  });

  it('should be chainable:', function(done) {
    view.use(function(inst) {
      assert(inst instanceof View);
    })
      .use(function(inst) {
        assert(inst instanceof View);
      })
      .use(function(inst) {
        assert(inst instanceof View);
        done();
      });
  });

  it('should expose the view to a plugin:', function() {
    view.use(function(view) {
      assert(view instanceof View);
      view.foo = function(str) {
        return str + ' ' + 'bar';
      };
    });
    assert(view.foo('foo') === 'foo bar');
  });

  it('should be chainable:', function() {
    view
      .use(function(view) {
        view.a = 'aaa';
      })
      .use(function(view) {
        view.b = 'bbb';
      })
      .use(function(view) {
        view.c = 'ccc';
      });

    assert(view.a === 'aaa');
    assert(view.b === 'bbb');
    assert(view.c === 'ccc');
  });
});
