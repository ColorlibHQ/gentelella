require('should');
var support = require('./support');
var App = support.resolve();
var app;

describe('collection.option()', function() {
  beforeEach(function() {
    app = new App();
    app.create('page');
  });

  it('should set an option:', function() {
    app.pages.options.should.not.have.property('foo');
    app.pages.option('foo', 'bar');
    app.pages.options.should.have.property('foo');
  });

  it('should extend options:', function() {
    app.pages('a.tmpl', {path: 'a.tmpl', content: '<%= a %>'});
    app.pages.option('a', 'b');
    app.pages.option('c', 'd');
    app.pages.option('e', 'f');
    app.pages.options.should.have.properties(['a', 'c', 'e']);
  });
});
