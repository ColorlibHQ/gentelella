require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var Views = App.Views;
var View = App.View;
var app;

describe('app.use', function() {
  beforeEach(function() {
    app = new App();
  });

  it('should expose the instance to `use`:', function(done) {
    app.use(function(inst) {
      assert(inst instanceof App);
      done();
    });
  });

  it('should be chainable:', function(done) {
    app.use(function(inst) {
      assert(inst instanceof App);
    })
      .use(function(inst) {
        assert(inst instanceof App);
      })
      .use(function(inst) {
        assert(inst instanceof App);
        done();
      });
  });

  it('should pass to collection `use` if a function is returned:', function() {
    app.use(function(inst) {
      assert(inst instanceof App);
      return function(collection) {
        collection.foo = collection.addView;
        assert(collection instanceof Views);
        return collection;
      };
    });

    app.create('pages')
      .foo({path: 'a.md', content: '...'})
      .addView({path: 'b.md', content: '...'})
      .addView({path: 'c.md', content: '...'});

    assert(app.views.pages.hasOwnProperty('a.md'));
    assert(app.views.pages.hasOwnProperty('b.md'));
    assert(app.views.pages.hasOwnProperty('c.md'));
  });

  it('should be chainable when a collection function is returned:', function() {
    app
      .use(function(inst) {
        assert(inst instanceof App);
        return function(collection) {
          collection.foo = collection.addView;
          assert(collection instanceof Views);
          return collection;
        };
      })
      .use(function(inst) {
        assert(inst instanceof App);
        return function(collection) {
          collection.bar = collection.addView;
          assert(collection instanceof Views);
          return collection;
        };
      })
      .use(function(inst) {
        assert(inst instanceof App);
        return function(collection) {
          collection.baz = collection.addView;
          assert(collection instanceof Views);
          return collection;
        };
      });

    var pages = app.create('pages');

    pages.foo({path: 'a.md', content: '...'});
    pages.bar({path: 'b.md', content: '...'});
    pages.baz({path: 'c.md', content: '...'});

    assert(app.views.pages.hasOwnProperty('a.md'));
    assert(app.views.pages.hasOwnProperty('b.md'));
    assert(app.views.pages.hasOwnProperty('c.md'));
  });

  it('should pass to view `use` if collection.use returns a function:', function() {
    app.use(function(inst) {
      assert(inst instanceof App);

      return function(collection) {
        assert(collection instanceof Views);
        collection.foo = collection.addView;

        return function(view) {
          assert(view instanceof View);
          view.foo = collection.addView.bind(collection);
          return view;
        };
      };
    });

    app.create('pages')
      .foo({path: 'a.md', content: '...'})
      .foo({path: 'b.md', content: '...'})
      .foo({path: 'c.md', content: '...'});

    assert(app.views.pages.hasOwnProperty('a.md'));
    assert(app.views.pages.hasOwnProperty('b.md'));
    assert(app.views.pages.hasOwnProperty('c.md'));
  });

  it('should be chainable when a view function is returned:', function() {
    app
      .use(function(inst) {
        assert(inst instanceof App);

        return function(collection) {
          assert(collection instanceof Views);
          collection.foo = collection.addView;

          return function(view) {
            assert(view instanceof View);
            view.a = collection.addView.bind(collection);
            return view;
          };
        };
      })
      .use(function(inst) {
        assert(inst instanceof App);

        return function(collection) {
          assert(collection instanceof Views);
          collection.bar = collection.addView;

          return function(view) {
            assert(view instanceof View);
            view.b = collection.addView.bind(collection);
            return view;
          };
        };
      })
      .use(function(inst) {
        assert(inst instanceof App);

        return function(collection) {
          assert(collection instanceof Views);
          collection.baz = collection.addView;

          return function(view) {
            assert(view instanceof View);
            view.c = collection.addView.bind(collection);
            return view;
          };
        };
      });

    var pages = app.create('pages');

    pages.foo({path: 'a.md', content: '...'});
    pages.bar({path: 'b.md', content: '...'});
    pages.baz({path: 'c.md', content: '...'})
      .a({path: 'x.md', content: '...'})
      .b({path: 'y.md', content: '...'})
      .c({path: 'z.md', content: '...'});

    assert(app.views.pages.hasOwnProperty('a.md'));
    assert(app.views.pages.hasOwnProperty('b.md'));
    assert(app.views.pages.hasOwnProperty('c.md'));

    assert(app.views.pages.hasOwnProperty('x.md'));
    assert(app.views.pages.hasOwnProperty('y.md'));
    assert(app.views.pages.hasOwnProperty('z.md'));
  });

  it('should work with multiple collections:', function() {
    app
      .use(function(inst) {
        assert(inst instanceof App);

        return function(collection) {
          assert(collection instanceof Views);
          collection.foo = collection.addView;

          return function(view) {
            assert(view instanceof View);
            view.a = collection.addView.bind(collection);
            return view;
          };
        };
      })
      .use(function(inst) {
        assert(inst instanceof App);

        return function(collection) {
          assert(collection instanceof Views);
          collection.bar = collection.addView;

          return function(view) {
            assert(view instanceof View);
            view.b = collection.addView.bind(collection);
            return view;
          };
        };
      })
      .use(function(inst) {
        assert(inst instanceof App);
        assert(this instanceof App);

        return function(collection) {
          collection.baz = collection.addView;
          assert(collection instanceof Views);
          assert(this instanceof Views);

          return function(view) {
            assert(this instanceof View);
            assert(view instanceof View);
            view.c = collection.addView.bind(collection);
            return view;
          };
        };
      });

    var pages = app.create('pages');

    pages.foo({path: 'a.md', content: '...'});
    pages.bar({path: 'b.md', content: '...'});
    pages.baz({path: 'c.md', content: '...'})
      .a({path: 'x.md', content: '...'})
      .b({path: 'y.md', content: '...'})
      .c({path: 'z.md', content: '...'});

    assert(app.views.pages.hasOwnProperty('a.md'));
    assert(app.views.pages.hasOwnProperty('b.md'));
    assert(app.views.pages.hasOwnProperty('c.md'));

    assert(app.views.pages.hasOwnProperty('x.md'));
    assert(app.views.pages.hasOwnProperty('y.md'));
    assert(app.views.pages.hasOwnProperty('z.md'));

    var posts = app.create('posts');

    posts.foo({path: 'a.md', content: '...'});
    posts.bar({path: 'b.md', content: '...'});
    posts.baz({path: 'c.md', content: '...'})
      .a({path: 'x.md', content: '...'})
      .b({path: 'y.md', content: '...'})
      .c({path: 'z.md', content: '...'});

    assert(app.views.posts.hasOwnProperty('a.md'));
    assert(app.views.posts.hasOwnProperty('b.md'));
    assert(app.views.posts.hasOwnProperty('c.md'));

    assert(app.views.posts.hasOwnProperty('x.md'));
    assert(app.views.posts.hasOwnProperty('y.md'));
    assert(app.views.posts.hasOwnProperty('z.md'));

    var docs = app.create('docs');

    docs.foo({path: 'a.md', content: '...'});
    docs.bar({path: 'b.md', content: '...'});
    docs.baz({path: 'c.md', content: '...'})
      .a({path: 'x.md', content: '...'})
      .b({path: 'y.md', content: '...'})
      .c({path: 'z.md', content: '...'});

    assert(app.views.docs.hasOwnProperty('a.md'));
    assert(app.views.docs.hasOwnProperty('b.md'));
    assert(app.views.docs.hasOwnProperty('c.md'));

    assert(app.views.docs.hasOwnProperty('x.md'));
    assert(app.views.docs.hasOwnProperty('y.md'));
    assert(app.views.docs.hasOwnProperty('z.md'));
  });
});
