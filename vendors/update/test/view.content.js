require('mocha');
require('should');
var fs = require('fs');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('content', function() {
  beforeEach(function() {
    app = new App();
    app.create('page');
    app.engine('tmpl', require('engine-base'));
  });

  it('should normalize the `content` property on a view to a string:', function(done) {
    app.page('abc', {path: 'test/fixtures/templates/a.tmpl'})
      .set('read', function() {
        this.contents = fs.readFileSync(this.path);
        return this;
      });

    app.views.pages.abc.read();

    assert('content' in app.views.pages.abc);
    assert(typeof app.views.pages.abc.content === 'string');
    done();
  });
});
