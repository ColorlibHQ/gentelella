require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var Collection = App.Collection;
var Item = App.Item;
var collection;

describe('collection.use', function() {
  beforeEach(function() {
    collection = new Collection();
  });

  it('should expose the instance to `use`:', function(done) {
    collection.use(function(inst) {
      assert(inst instanceof Collection);
      done();
    });
  });

  it('should be chainable:', function(done) {
    collection.use(function(inst) {
      assert(inst instanceof Collection);
    })
      .use(function(inst) {
        assert(inst instanceof Collection);
      })
      .use(function(inst) {
        assert(inst instanceof Collection);
        done();
      });
  });

  it('should expose the collection to a plugin:', function() {
    collection.use(function(items) {
      assert(items instanceof Collection);
      items.foo = items.addItem.bind(items);
    });

    collection.foo('a', {content: '...'});
    assert(collection.items.hasOwnProperty('a'));
  });

  it('should expose collection when chained:', function() {
    collection
      .use(function(items) {
        assert(items instanceof Collection);
        items.foo = items.addItem.bind(items);
      })
      .use(function(items) {
        assert(items instanceof Collection);
        items.bar = items.addItem.bind(items);
      })
      .use(function(items) {
        assert(items instanceof Collection);
        items.baz = items.addItem.bind(items);
      });

    var pages = collection;

    pages.foo({path: 'a', content: '...'});
    pages.bar({path: 'b', content: '...'});
    pages.baz({path: 'c', content: '...'});

    assert(collection.items.hasOwnProperty('a'));
    assert(collection.items.hasOwnProperty('b'));
    assert(collection.items.hasOwnProperty('c'));
  });

  it('should work when a custom `Item` constructor is passed:', function() {
    collection = new Collection({Item: require('vinyl')});
    collection
      .use(function(items) {
        assert(items instanceof Collection);
        items.foo = items.addItem.bind(items);
      })
      .use(function(items) {
        assert(items instanceof Collection);
        items.bar = items.addItem.bind(items);
      })
      .use(function(items) {
        assert(items instanceof Collection);
        items.baz = items.addItem.bind(items);
      });

    var pages = collection;

    pages.foo({path: 'a', content: '...'});
    pages.bar({path: 'b', content: '...'});
    pages.baz({path: 'c', content: '...'});

    assert(collection.items.hasOwnProperty('a'));
    assert(collection.items.hasOwnProperty('b'));
    assert(collection.items.hasOwnProperty('c'));
  });

  it('should pass to item `use` if a function is returned:', function() {
    collection.use(function(items) {
      assert(items instanceof Collection);

      return function(item) {
        item.foo = items.addItem.bind(items);
        assert(item instanceof Item);
      };
    });

    collection.addItem('a', {content: '...'})
      .foo({path: 'b', content: '...'})
      .foo({path: 'c', content: '...'})
      .foo({path: 'd', content: '...'});

    assert(collection.items.hasOwnProperty('a'));
    assert(collection.items.hasOwnProperty('b'));
    assert(collection.items.hasOwnProperty('c'));
    assert(collection.items.hasOwnProperty('d'));
  });

  it('should be chainable when a item function is returned:', function() {
    collection
      .use(function(items) {
        assert(items instanceof Collection);

        return function(item) {
          item.foo = items.addItem.bind(items);
          assert(item instanceof Item);
        };
      })
      .use(function(items) {
        assert(items instanceof Collection);

        return function(item) {
          item.bar = items.addItem.bind(items);
          assert(item instanceof Item);
        };
      })
      .use(function(items) {
        assert(items instanceof Collection);

        return function(item) {
          item.baz = items.addItem.bind(items);
          assert(item instanceof Item);
        };
      });

    collection.addItem('a', {content: '...'})
      .foo({path: 'b', content: '...'})
      .bar({path: 'c', content: '...'})
      .baz({path: 'd', content: '...'});

    assert(collection.items.hasOwnProperty('a'));
    assert(collection.items.hasOwnProperty('b'));
    assert(collection.items.hasOwnProperty('c'));
    assert(collection.items.hasOwnProperty('d'));
  });
});
