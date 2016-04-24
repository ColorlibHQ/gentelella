require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var List = App.List;
var list;

describe('app.list.compile', function() {
  beforeEach(function() {
    list = new List();
    list.engine('tmpl', require('engine-base'));
  });

  it('should compile an item:', function() {
    var buffer = new Buffer('a b c');
    var item = list.addItem('a.tmpl', {contents: buffer})
      .compile();

    assert(typeof item.fn === 'function');
  });

  it('should use the compiled function to render:', function() {
    var buffer = new Buffer('a <%= title %> c');
    var item = list.addItem('a.tmpl', {contents: buffer})
      .compile();

    assert(item.fn({title: 'z'}));
    assert(typeof item.fn({title: 'z'}) === 'string');
    assert(item.fn({title: 'z'}) === 'a z c');
  });

  it('should compile a view by name:', function() {
    var buffer = new Buffer('a <%= title %> c');
    list.addItem('a.tmpl', {contents: buffer});

    var item = list.compile('a.tmpl');

    assert(item.fn({title: 'z'}));
    assert(typeof item.fn({title: 'z'}) === 'string');
    assert(item.fn({title: 'z'}) === 'a z c');
  });
});

