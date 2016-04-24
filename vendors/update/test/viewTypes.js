var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('viewType', function() {
  describe('view types', function() {
    beforeEach(function() {
      app = new App();
      app.engine('tmpl', require('engine-base'));
    });

    it('should add collection (plural) to the `viewTypes` object', function() {
      app.viewTypes = []; // reset
      app.create('foo', {viewType: 'layout'});
      app.create('bar', {viewType: 'layout'});
      assert.deepEqual(app.viewTypes.layout, [ 'foos', 'bars' ]);

      app.create('baz', {viewType: 'renderable'});
      assert.deepEqual(app.viewTypes.renderable, [ 'bazs' ]);
    });

    it('should add collection to the given viewType', function() {
      app.create('layout', {viewType: 'layout'});
      assert(app.layouts.options.viewType[0] === 'layout');
    });

    it('should return true if a collection has the given viewType', function() {
      app.create('layout', {viewType: 'layout'});
      assert(app.layouts.isType('layout'));
      assert(!app.layouts.isType('partial'));
    });

    it('should add types to the collection', function() {
      app.create('layout', {viewType: 'layout'});
      app.layouts.viewType('partial');
      assert(app.layouts.options.viewType[0] === 'layout');
      assert(app.layouts.options.viewType[1] === 'partial');
    });

    it('should add a collection to multiple viewTypes', function() {
      app.create('foo', {viewType: ['layout', 'renderable']});
      assert.deepEqual(app.foos.options.viewType, ['layout', 'renderable']);
    });

    it('should expose viewType on `view`', function() {
      app.create('foo', {viewType: ['layout', 'renderable']});
      var a = app.foo('a', {content: ''});
      assert.deepEqual(app.foos.options.viewType, a.options.viewType);
    });
  });
});
