require('mocha');
require('should');
var fs = require('fs');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('set', function() {
  beforeEach(function() {
    app = new App();
    app.create('page');
    app.engine('tmpl', require('engine-base'));
  });

  it('should set a property on a view:', function(done) {
    app.page('abc', {path: 'test/fixtures/templates/a.tmpl'})
      .set('read', function() {
        this.contents = fs.readFileSync(this.path);
        return this;
      });

    assert('read' in app.views.pages.abc);
    app.views.pages.abc
      .read()
      .set('data.name', 'Brooke')
      .render(function(err, res) {
        if (err) return done(err);

        assert(res.content === 'Brooke');
        done();
      });
  });
});
