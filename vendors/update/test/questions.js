require('mocha');
require('should');
var fs = require('fs');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe.skip('content', function() {
  beforeEach(function() {
    app = new App();
  });

  it('should store a question:', function() {
    app.question('a', 'b');
    assert(app.questions);
    assert(app.questions.cache);
    assert(app.questions.cache.a);
    assert(app.questions.cache.a.name === 'a');
    assert(app.questions.cache.a.message === 'b');
  });

  it('should ask a question and use data value to answer:', function(done) {
    app.question('a', 'b');
    app.data('a', 'b');

    app.ask('a', function(err, answer) {
      assert(!err);
      assert(answer);
      assert(answer === 'b');
      done();
    })
  });

  it('should ask a question and use store value to answer:', function(done) {
    app.question('a', 'b');
    app.store.set('a', 'c');

    app.ask('a', function(err, answer) {
      assert(!err);
      assert(answer);
      assert(answer === 'c');
      done();
    })
  });

  it('should ask a question and use config value to answer:', function(done) {
    app.question('a', 'b');
    app.store.set('a', 'c');

    app.ask('a', function(err, answer) {
      assert(!err);
      assert(answer);
      assert(answer === 'c');
      done();
    })
  });
});
