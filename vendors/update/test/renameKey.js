var path = require('path');
var support = require('./support');
var App = support.resolve();
var app;

function renameKey(key) {
  return path.basename(key, path.extname(key));
}

describe('renameKey', function() {
  beforeEach(function() {
    app = new App();
    app.engine('tmpl', require('engine-base'));
    app.create('pages');
    app.create('posts');
  });

  describe('global options:', function() {
    it('should use `renameKey` function defined on global opts:', function() {
      app.option('renameKey', renameKey);

      app.posts('a/b/c/a.txt', {content: '...'});
      app.posts('a/b/c/b.txt', {content: '...'});
      app.posts('a/b/c/c.txt', {content: '...'});
      app.post('a/b/c/d.txt', {content: '...'});
      app.post('a/b/c/e.txt', {content: '...'});

      app.views.posts.should.have.property('a');
      app.views.posts.should.have.property('b');
      app.views.posts.should.have.property('c');
      app.views.posts.should.have.property('d');
      app.views.posts.should.have.property('e');
    });

    it('should not have conflicts when view name is the collection name:', function() {
      app.option('renameKey', renameKey);

      app.post('a/b/c/post.txt', {content: 'this is contents'});
      app.page('a/b/c/page.txt', {content: 'this is contents'});

      app.views.posts.should.have.property('post');
      app.views.pages.should.have.property('page');
    });
  });

  describe('create method:', function() {
    it('should use `renameKey` option chained from the `create` method:', function() {
      app.create('post')
        .option('renameKey', function(key) {
          return 'posts/' + path.basename(key);
        });

      app.posts('a/b/c/a.txt', {content: '...'});
      app.posts('a/b/c/b.txt', {content: '...'});
      app.posts('a/b/c/c.txt', {content: '...'});
      app.post('a/b/c/d.txt', {content: '...'});
      app.post('a/b/c/e.txt', {content: '...'});

      app.views.posts.should.have.property('posts/a.txt');
      app.views.posts.should.have.property('posts/b.txt');
      app.views.posts.should.have.property('posts/c.txt');
      app.views.posts.should.have.property('posts/d.txt');
      app.views.posts.should.have.property('posts/e.txt');
    });
  });

  describe('create method:', function() {
    it('should use `renameKey` defined on the `create` method:', function() {
      app.create('post', {
        renameKey: function(key) {
          return 'posts/' + path.basename(key);
        }
      });

      app.posts('a/b/c/a.txt', {content: '...'});
      app.posts('a/b/c/b.txt', {content: '...'});
      app.posts('a/b/c/c.txt', {content: '...'});
      app.post('a/b/c/d.txt', {content: '...'});
      app.post('a/b/c/e.txt', {content: '...'});

      app.views.posts.should.have.property('posts/a.txt');
      app.views.posts.should.have.property('posts/b.txt');
      app.views.posts.should.have.property('posts/c.txt');
      app.views.posts.should.have.property('posts/d.txt');
      app.views.posts.should.have.property('posts/e.txt');
    });
  });

  describe('collections:', function() {
    describe('setting:', function() {
      it('should get a view with the `renameKey` defined on app.options:', function() {
        app.option('renameKey', function(key) {
          return 'foo/' + path.basename(key);
        });

        app.posts('a/b/c/a.txt', {content: '...'});
        app.posts('a/b/c/b.txt', {content: '...'});
        app.post('a/b/c/c.txt', {content: '...'});

        app.views.posts.should.have.property('foo/a.txt');
        app.views.posts.should.have.property('foo/b.txt');
        app.views.posts.should.have.property('foo/c.txt');
      });

      it('should use `renameKey` defined on collection.options:', function() {
        app.pages.option('renameKey', function(key) {
          return 'page/' + path.basename(key);
        });

        app.posts.option('renameKey', function(key) {
          return 'post/' + path.basename(key);
        });

        app.pages('a/b/c/a.txt', {content: '...'});
        app.pages('a/b/c/b.txt', {content: '...'});
        app.pages('a/b/c/c.txt', {content: '...'});
        app.page('a/b/c/d.txt', {content: '...'});
        app.page('a/b/c/e.txt', {content: '...'});

        app.posts('a/b/c/a.txt', {content: '...'});
        app.posts('a/b/c/b.txt', {content: '...'});
        app.posts('a/b/c/c.txt', {content: '...'});
        app.post('a/b/c/d.txt', {content: '...'});
        app.post('a/b/c/e.txt', {content: '...'});

        app.views.pages.should.have.property('page/a.txt');
        app.views.pages.should.have.property('page/b.txt');
        app.views.pages.should.have.property('page/c.txt');
        app.views.pages.should.have.property('page/d.txt');
        app.views.pages.should.have.property('page/e.txt');

        app.views.posts.should.have.property('post/a.txt');
        app.views.posts.should.have.property('post/b.txt');
        app.views.posts.should.have.property('post/c.txt');
        app.views.posts.should.have.property('post/d.txt');
        app.views.posts.should.have.property('post/e.txt');
      });

      it('should use the `collection.renameKey()` method:', function() {
        app.pages.renameKey(function(key) {
          return 'baz/' + path.basename(key);
        });

        app.pages('a/b/c/a.txt', {content: '...'});
        app.pages('a/b/c/b.txt', {content: '...'});
        app.pages('a/b/c/c.txt', {content: '...'});
        app.page('a/b/c/d.txt', {content: '...'});
        app.page('a/b/c/e.txt', {content: '...'});

        app.views.pages.should.have.property('baz/a.txt');
        app.views.pages.should.have.property('baz/b.txt');
        app.views.pages.should.have.property('baz/c.txt');
        app.views.pages.should.have.property('baz/d.txt');
        app.views.pages.should.have.property('baz/e.txt');
      });

      it('should use the `app.renameKey()` method:', function() {
        app.renameKey(function(key) {
          return 'app/' + path.basename(key);
        });

        app.pages('a/b/c/a.txt', {content: '...'});
        app.pages('a/b/c/b.txt', {content: '...'});
        app.pages('a/b/c/c.txt', {content: '...'});
        app.page('a/b/c/d.txt', {content: '...'});
        app.page('a/b/c/e.txt', {content: '...'});

        app.views.pages.should.have.property('app/a.txt');
        app.views.pages.should.have.property('app/b.txt');
        app.views.pages.should.have.property('app/c.txt');
        app.views.pages.should.have.property('app/d.txt');
        app.views.pages.should.have.property('app/e.txt');
      });

      it('should prefer collection method over app.options:', function() {
        // this works when you switch the order around...
        app.pages.renameKey(function pagesRenameKey(key) {
          return 'aaa/' + path.basename(key);
        });
        app.option('renameKey', function optsRenameKey(key) {
          return 'foo/' + path.basename(key);
        });

        app.pages('a/b/c/a.txt', {content: '...'});
        app.pages('a/b/c/b.txt', {content: '...'});
        app.pages('a/b/c/c.txt', {content: '...'});
        app.page('a/b/c/d.txt', {content: '...'});
        app.page('a/b/c/e.txt', {content: '...'});

        app.views.pages.should.have.property('aaa/a.txt');
        app.views.pages.should.have.property('aaa/b.txt');
        app.views.pages.should.have.property('aaa/c.txt');
        app.views.pages.should.have.property('aaa/d.txt');
        app.views.pages.should.have.property('aaa/e.txt');
      });

      it('should prefer collection method over app method:', function() {
        app.pages.renameKey(function(key) {
          return 'aaa/' + path.basename(key);
        });
        app.renameKey(function(key) {
          return 'zzz/' + path.basename(key);
        });

        app.pages('a/b/c/a.txt', {content: '...'});
        app.pages('a/b/c/b.txt', {content: '...'});
        app.pages('a/b/c/c.txt', {content: '...'});
        app.page('a/b/c/d.txt', {content: '...'});
        app.page('a/b/c/e.txt', {content: '...'});

        app.views.pages.should.have.property('aaa/a.txt');
        app.views.pages.should.have.property('aaa/b.txt');
        app.views.pages.should.have.property('aaa/c.txt');
        app.views.pages.should.have.property('aaa/d.txt');
        app.views.pages.should.have.property('aaa/e.txt');
      });

      it('should prefer collection options over app.options:', function() {
        app.pages.option('renameKey', function(key) {
          return 'collection/' + path.basename(key);
        });
        app.option('renameKey', function(key) {
          return 'app/' + path.basename(key);
        });

        app.pages('a/b/c/a.txt', {content: '...'});
        app.pages('a/b/c/b.txt', {content: '...'});
        app.pages('a/b/c/c.txt', {content: '...'});
        app.page('a/b/c/d.txt', {content: '...'});
        app.page('a/b/c/e.txt', {content: '...'});

        app.views.pages.should.have.property('collection/a.txt');
        app.views.pages.should.have.property('collection/b.txt');
        app.views.pages.should.have.property('collection/c.txt');
        app.views.pages.should.have.property('collection/d.txt');
        app.views.pages.should.have.property('collection/e.txt');
      });

      it('should prefer collection options over app method:', function() {
        app.pages.option('renameKey', function(key) {
          return 'collection/' + path.basename(key);
        });
        app.renameKey(function(key) {
          return 'app/' + path.basename(key);
        });

        app.pages('a/b/c/a.txt', {content: '...'});
        app.pages('a/b/c/b.txt', {content: '...'});
        app.pages('a/b/c/c.txt', {content: '...'});
        app.page('a/b/c/d.txt', {content: '...'});
        app.page('a/b/c/e.txt', {content: '...'});

        app.views.pages.should.have.property('collection/a.txt');
        app.views.pages.should.have.property('collection/b.txt');
        app.views.pages.should.have.property('collection/c.txt');
        app.views.pages.should.have.property('collection/d.txt');
        app.views.pages.should.have.property('collection/e.txt');
      });

      it('should use renameKey on chained methods:', function() {
        app.page('test/fixtures/pages/a.txt', {
          options: {
            renameKey: function foo(key) {
              return 'foo/' + path.basename(key);
            }
          }
        });

        app.page('test/fixtures/pages/a.hbs', {
          options: {
            renameKey: function bar(key) {
              return 'bar/' + path.basename(key);
            }
          }
        });

        app.views.pages.should.have.properties([
          'foo/a.txt',
          'bar/a.hbs'
        ]);
      });
    });

    describe('getting', function() {
      beforeEach(function() {
        app = new App();
        app.engine('tmpl', require('engine-base'));
        app.create('post');
        app.create('page');
      });

      it('should get a view with the `renameKey` defined on the `create` method:', function() {
        app.create('post', {
          renameKey: function createRenameKey(key) {
            return 'posts/' + path.basename(key);
          }
        });

        app.posts('a/b/c/a.txt', {content: '...'});
        app.posts('a/b/c/b.txt', {content: '...'});
        app.post('a/b/c/c.txt', {content: '...'});

        app.posts.getView('a.txt').should.have.property('path', 'a/b/c/a.txt');
        app.posts.getView('posts/a.txt').should.have.property('path', 'a/b/c/a.txt');
      });

      it('should get a view with `renameKey` on collection.options:', function() {
        app.pages.option('renameKey', function(key) {
          return 'bar/' + path.basename(key);
        });

        app.pages('a/b/c/a.txt', {content: '...'});
        app.pages('a/b/c/b.txt', {content: '...'});
        app.page('a/b/c/c.txt', {content: '...'});

        app.views.pages.should.have.property('bar/a.txt');
        app.views.pages.should.have.property('bar/b.txt');
        app.views.pages.should.have.property('bar/c.txt');
      });

      it('should get a view with the the `app.renameKey()` method:', function() {
        app.renameKey(function(key) {
          return 'baz/' + path.basename(key);
        });

        app.pages('a/b/c/a.txt', {content: '...'});
        app.pages('a/b/c/b.txt', {content: '...'});
        app.page('a/b/c/c.txt', {content: '...'});

        app.views.pages.should.have.property('baz/a.txt');
        app.views.pages.should.have.property('baz/b.txt');
        app.views.pages.should.have.property('baz/c.txt');
      });

      it('should get a view with the the `collection.renameKey()` method:', function() {
        app.pages.renameKey(function(key) {
          return 'baz/' + path.basename(key);
        });

        app.pages('a/b/c/a.txt', {content: '...'});
        app.pages('a/b/c/b.txt', {content: '...'});
        app.page('a/b/c/c.txt', {content: '...'});

        app.views.pages.should.have.property('baz/a.txt');
        app.views.pages.should.have.property('baz/b.txt');
        app.views.pages.should.have.property('baz/c.txt');
      });
    });
  });
});
