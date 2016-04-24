require('should');
var support = require('./support');
var App = support.resolve();
var app;

describe('view.option()', function() {
  beforeEach(function() {
    app = new App();
    app.create('page');
  });

  it('should set an option:', function() {
    app.pages('a.tmpl', {path: 'a.tmpl', content: '<%= a %>'});
    var page = app.pages.getView('a.tmpl');

    page.options.should.not.have.property('foo');
    page.option('foo', 'bar');
    page.options.should.have.property('foo');
  });

  it('should extend options:', function() {
    app.pages('a.tmpl', {path: 'a.tmpl', content: '<%= a %>'});
    var page = app.pages.getView('a.tmpl');
    page.option('a', 'b');
    page.option('c', 'd');
    page.option('e', 'f');
    page.options.should.have.properties(['a', 'c', 'e']);
  });
});
