require('should');
var support = require('./support');
var App = support.resolve();
var app;

describe('view.option()', function() {
  beforeEach(function() {
    app = new App();
    app.engine('tmpl', require('engine-base'));
    app.create('page');
  });

  describe('.use', function() {
    it('should expose `.use` for running plugins on a view:', function() {
      app.page('a.tmpl', {path: 'a.tmpl', content: '<%= a %>'})
        .use(function() {
          this.options.foo = 'bar';
        })
        .use(function() {
          this.options.bar = 'baz';
        });

      var page = app.pages.getView('a.tmpl');
      page.options.should.have.property('foo');
      page.options.should.have.property('bar');
    });
  });

  describe('.render:', function() {
    it('should expose `.render` for rendering a view:', function(done) {
      app.page('a.tmpl', {path: 'a.tmpl', content: '<%= a %>', locals: {a: 'bbb'}})
        .render({}, function(err, res) {
          if (err) return done(err);
          res.contents.toString().should.equal('bbb');
          done();
        });
    });
  });
});
