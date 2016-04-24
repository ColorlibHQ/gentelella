require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var List = App.List;
var Item = App.Item;
var list;

describe('list.use', function() {
  beforeEach(function() {
    list = new List();
  });

  it('should expose the instance to `use`:', function(done) {
    list.use(function(inst) {
      assert(inst instanceof List);
      done();
    });
  });

  it('should be chainable:', function(done) {
    list.use(function(inst) {
      assert(inst instanceof List);
    })
      .use(function(inst) {
        assert(inst instanceof List);
      })
      .use(function(inst) {
        assert(inst instanceof List);
        done();
      });
  });

  it('should expose the list to a plugin:', function() {
    list.use(function(items) {
      assert(items instanceof List);
      items.foo = items.addItem.bind(items);
    });

    list.foo('a', {content: '...'});
    assert(list.hasItem('a'));
  });

  it('should expose list when chained:', function() {
    list
      .use(function(items) {
        assert(items instanceof List);
        items.foo = items.addItem.bind(items);
      })
      .use(function(items) {
        assert(items instanceof List);
        items.bar = items.addItem.bind(items);
      })
      .use(function(items) {
        assert(items instanceof List);
        items.baz = items.addItem.bind(items);
      });

    var pages = list;

    pages.foo({path: 'a', content: '...'});
    pages.bar({path: 'b', content: '...'});
    pages.baz({path: 'c', content: '...'});

    assert(list.hasItem('a'));
    assert(list.hasItem('b'));
    assert(list.hasItem('c'));
  });

  it('should work when a custom `Item` constructor is passed:', function() {
    list = new List({Item: require('vinyl')});
    list
      .use(function(items) {
        assert(items instanceof List);
        items.foo = items.addItem.bind(items);
      })
      .use(function(items) {
        assert(items instanceof List);
        items.bar = items.addItem.bind(items);
      })
      .use(function(items) {
        assert(items instanceof List);
        items.baz = items.addItem.bind(items);
      });

    var pages = list;

    pages.foo({path: 'a', content: '...'});
    pages.bar({path: 'b', content: '...'});
    pages.baz({path: 'c', content: '...'});

    assert(list.hasItem('a'));
    assert(list.hasItem('b'));
    assert(list.hasItem('c'));
  });

  it('should pass to item `use` if a function is returned:', function() {
    list.use(function(items) {
      assert(items instanceof List);

      return function(item) {
        item.foo = items.addItem.bind(items);
        assert(item.isItem || item.isView);
      };
    });

    list.addItem('a', {content: '...'})
      .foo({path: 'b', content: '...'})
      .foo({path: 'c', content: '...'})
      .foo({path: 'd', content: '...'});

    assert(list.hasItem('a'));
    assert(list.hasItem('b'));
    assert(list.hasItem('c'));
    assert(list.hasItem('d'));
  });

  it('should be chainable when a item function is returned:', function() {
    list
      .use(function(items) {
        assert(items instanceof List);

        return function(item) {
          item.foo = items.addItem.bind(items);
          assert(item instanceof Item);
        };
      })
      .use(function(items) {
        assert(items instanceof List);

        return function(item) {
          item.bar = items.addItem.bind(items);
          assert(item instanceof Item);
        };
      })
      .use(function(items) {
        assert(items instanceof List);

        return function(item) {
          item.baz = items.addItem.bind(items);
          assert(item instanceof Item);
        };
      });

    list.addItem('a', {content: '...'})
      .foo({path: 'b', content: '...'})
      .bar({path: 'c', content: '...'})
      .baz({path: 'd', content: '...'});

    assert(list.hasItem('a'));
    assert(list.hasItem('b'));
    assert(list.hasItem('c'));
    assert(list.hasItem('d'));
  });
});
