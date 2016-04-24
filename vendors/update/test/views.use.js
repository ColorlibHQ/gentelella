require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var Views = App.Views;
var View = App.View;
var collection;

describe('views.use', function() {
  beforeEach(function() {
    collection = new Views();
  });

  it('should expose the instance to `use`:', function(done) {
    collection.use(function(inst) {
      assert(inst instanceof Views);
      done();
    });
  });

  it('should be chainable:', function(done) {
    collection.use(function(inst) {
      assert(inst instanceof Views);
    })
      .use(function(inst) {
        assert(inst instanceof Views);
      })
      .use(function(inst) {
        assert(inst instanceof Views);
        done();
      });
  });

  it('should expose the collection to a plugin:', function() {
    collection.use(function(views) {
      assert(views instanceof Views);
      views.foo = views.addView.bind(views);
    });

    collection.foo('a', {content: '...'});
    assert(collection.views.hasOwnProperty('a'));
  });

  it('should expose collection when chained:', function() {
    collection
      .use(function(views) {
        assert(views instanceof Views);
        views.foo = views.addView.bind(views);
      })
      .use(function(views) {
        assert(views instanceof Views);
        views.bar = views.addView.bind(views);
      })
      .use(function(views) {
        assert(views instanceof Views);
        views.baz = views.addView.bind(views);
      });

    var pages = collection;

    pages.foo({path: 'a', content: '...'});
    pages.bar({path: 'b', content: '...'});
    pages.baz({path: 'c', content: '...'});

    assert(collection.views.hasOwnProperty('a'));
    assert(collection.views.hasOwnProperty('b'));
    assert(collection.views.hasOwnProperty('c'));
  });

  it('should work when a custom `View` constructor is passed:', function() {
    collection = new Views({View: require('vinyl')});
    collection
      .use(function(views) {
        assert(views instanceof Views);
        views.foo = views.addView.bind(views);
      })
      .use(function(views) {
        assert(views instanceof Views);
        views.bar = views.addView.bind(views);
      })
      .use(function(views) {
        assert(views instanceof Views);
        views.baz = views.addView.bind(views);
      });

    var pages = collection;

    pages.foo({path: 'a', content: '...'});
    pages.bar({path: 'b', content: '...'});
    pages.baz({path: 'c', content: '...'});

    assert(collection.views.hasOwnProperty('a'));
    assert(collection.views.hasOwnProperty('b'));
    assert(collection.views.hasOwnProperty('c'));
  });

  it('should pass to view `use` if a function is returned:', function() {
    collection.use(function(views) {
      assert(views instanceof Views);

      return function(view) {
        view.foo = views.addView.bind(views);
        assert(view instanceof View);
      };
    });

    collection.addView('a', {content: '...'})
      .foo({path: 'b', content: '...'})
      .foo({path: 'c', content: '...'})
      .foo({path: 'd', content: '...'});

    assert(collection.views.hasOwnProperty('a'));
    assert(collection.views.hasOwnProperty('b'));
    assert(collection.views.hasOwnProperty('c'));
    assert(collection.views.hasOwnProperty('d'));
  });

  it('should be chainable when a view function is returned:', function() {
    collection
      .use(function(views) {
        assert(views instanceof Views);

        return function(view) {
          view.foo = views.addView.bind(views);
          assert(view instanceof View);
        };
      })
      .use(function(views) {
        assert(views instanceof Views);

        return function(view) {
          view.bar = views.addView.bind(views);
          assert(view instanceof View);
        };
      })
      .use(function(views) {
        assert(views instanceof Views);

        return function(view) {
          view.baz = views.addView.bind(views);
          assert(view instanceof View);
        };
      });

    collection.addView('a', {content: '...'})
      .foo({path: 'b', content: '...'})
      .bar({path: 'c', content: '...'})
      .baz({path: 'd', content: '...'});

    assert(collection.views.hasOwnProperty('a'));
    assert(collection.views.hasOwnProperty('b'));
    assert(collection.views.hasOwnProperty('c'));
    assert(collection.views.hasOwnProperty('d'));
  });
});
