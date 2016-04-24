'use strict';

require('mocha');
require('should');
var path = require('path');
var Base = require('base');
var assert = require('assert');
var consolidate = require('consolidate');
var handlebars = require('engine-handlebars');
var matter = require('parser-front-matter');
var swig = consolidate.swig;
require('swig');

var support = require('./support');
var App = support.resolve();
var helpers = App._.proto.helpers;
var init = App._.proto.init;
var app;

describe('helpers', function() {
  describe('constructor', function() {
    it('should create an instance of Helpers:', function() {
      app = new App();
      assert(app instanceof App);
    });
  });

  describe('prototype methods', function() {
    beforeEach(function() {
      app = new App();
    });
    it('should expose `helper`', function() {
      assert(typeof app.helper === 'function');
    });
    it('should expose `asyncHelper`', function() {
      assert(typeof app.asyncHelper === 'function');
    });
  });

  describe('instance', function() {
    it('should prime _', function() {
      function Foo() {
        Base.call(this);
        init(this);
      }
      Base.extend(Foo);
      var foo = new Foo();
      helpers(foo);
      assert(typeof foo._ === 'object');
    });
  });

  describe('helpers', function() {
    beforeEach(function() {
      app = new App();
    });

    it('should add a sync helper to the `sync` object:', function() {
      app.helper('one', function() {});
      assert(typeof app._.helpers.sync.one === 'function');
    });

    it('should load a glob of sync helper functions:', function() {
      app.helpers('test/fixtures/helpers/[a-c].js');

      assert(typeof app._.helpers.sync.c === 'function');
      assert(typeof app._.helpers.sync.b === 'function');
      assert(typeof app._.helpers.sync.a === 'function');
    });

    it('should fail gracefully on bad globs:', function(cb) {
      try {
        app.helpers('test/fixtures/helpers/*.foo');
        cb();
      } catch (err) {
        cb(new Error('should not throw an error.'));
      }
    });

    it('should add a glob of sync helper objects:', function() {
      app.helpers('test/fixtures/helpers/!([a-c]).js');
      assert(typeof app._.helpers.sync.one === 'function');
      assert(typeof app._.helpers.sync.two === 'function');
      assert(typeof app._.helpers.sync.three === 'function');
    });

    it('should add a glob with mixed helper objects and functions:', function() {
      app.helpers('test/fixtures/helpers/*.js');
      assert(typeof app._.helpers.sync.a === 'function');
      assert(typeof app._.helpers.sync.b === 'function');
      assert(typeof app._.helpers.sync.c === 'function');
      assert(typeof app._.helpers.sync.one === 'function');
      assert(typeof app._.helpers.sync.two === 'function');
      assert(typeof app._.helpers.sync.three === 'function');
    });

    it('should add an object of sync helpers to the `sync` object:', function() {
      app.helpers({
        x: function() {},
        y: function() {},
        z: function() {}
      });

      assert(typeof app._.helpers.sync.x === 'function');
      assert(typeof app._.helpers.sync.y === 'function');
      assert(typeof app._.helpers.sync.z === 'function');
    });

    it('should add a helper "group":', function() {
      app.helperGroup('foo', {
        x: function() {},
        y: function() {},
        z: function() {}
      });

      assert(typeof app._.helpers.sync.foo.x === 'function');
      assert(typeof app._.helpers.sync.foo.y === 'function');
      assert(typeof app._.helpers.sync.foo.z === 'function');
    });
  });

  describe('async helpers', function() {
    beforeEach(function() {
      app = new App();
    });

    it('should add an async helper to the `async` object:', function() {
      app.asyncHelper('two', function() {});
      assert(typeof app._.helpers.async.two === 'function');
    });

    it('should load a glob of async helper functions:', function() {
      app.asyncHelpers('test/fixtures/helpers/[a-c].js');
      assert(typeof app._.helpers.async.a === 'function');
      assert(typeof app._.helpers.async.b === 'function');
      assert(typeof app._.helpers.async.c === 'function');
    });

    it('should add a glob of async helper objects:', function() {
      app.asyncHelpers('test/fixtures/helpers/!([a-c]).js');
      assert(typeof app._.helpers.async.one === 'function');
      assert(typeof app._.helpers.async.two === 'function');
      assert(typeof app._.helpers.async.three === 'function');
    });

    it('should fail gracefully on bad globs:', function(cb) {
      try {
        app.asyncHelpers('test/fixtures/helpers/*.foo');
        cb();
      } catch (err) {
        cb(new Error('should not throw an error.'));
      }
    });

    it('should add a glob with mixed helper objects and functions:', function() {
      app.asyncHelpers('test/fixtures/helpers/*.js');
      assert(typeof app._.helpers.async.a === 'function');
      assert(typeof app._.helpers.async.b === 'function');
      assert(typeof app._.helpers.async.c === 'function');
      assert(typeof app._.helpers.async.one === 'function');
      assert(typeof app._.helpers.async.two === 'function');
      assert(typeof app._.helpers.async.three === 'function');
    });

    it('should add an object of async helpers to the `async` object:', function() {
      app.asyncHelpers({
        x: function() {},
        y: function() {},
        z: function() {}
      });

      assert(typeof app._.helpers.async.x === 'function');
      assert(typeof app._.helpers.async.y === 'function');
      assert(typeof app._.helpers.async.z === 'function');
    });

    it('should add an async helper "group":', function() {
      app.helperGroup('foo', {
        x: function() {},
        y: function() {},
        z: function() {}
      }, true);

      assert(typeof app._.helpers.async.foo.x === 'function');
      assert(typeof app._.helpers.async.foo.y === 'function');
      assert(typeof app._.helpers.async.foo.z === 'function');
    });
  });
});

describe('sync helpers', function() {
  beforeEach(function() {
    app = new App();
    app.engine('tmpl', require('engine-base'));
    app.create('page');
  });

  it('should register a helper:', function() {
    app.helper('a', function() {});
    app.helper('b', function() {});
    assert(app._.helpers.sync.hasOwnProperty('a'));
    assert(app._.helpers.sync.hasOwnProperty('b'));
  });

  it('should use a helper:', function(cb) {
    app.pages('a.tmpl', {path: 'a.tmpl', content: '<%= upper(a) %>', locals: {a: 'bbb'}});
    app.helper('upper', function(str) {
      return str.toUpperCase();
    });

    var page = app.pages.getView('a.tmpl');

    app.render(page, function(err, view) {
      if (err) return cb(err);

      assert.equal(typeof view.contents.toString(), 'string');
      assert.equal(view.contents.toString(), 'BBB');
      cb();
    });
  });

  it('should use a namespaced helper:', function(cb) {
    app.pages('a.tmpl', {path: 'a.tmpl', content: '<%= foo.upper(a) %>', locals: {a: 'bbb'}});

    app.helperGroup('foo', {
      upper: function(str) {
        return str.toUpperCase();
      }
    });

    // console.log(app._.helpers)

    var page = app.pages.getView('a.tmpl');
    app.render(page, function(err, view) {
      if (err) return cb(err);

      assert.equal(typeof view.contents.toString(), 'string');
      assert.equal(view.contents.toString(), 'BBB');
      cb();
    });
  });
});

describe('async helpers', function() {
  beforeEach(function() {
    app = new App();
    app.engine('tmpl', require('engine-base'));
    app.create('page');
  });

  it('should register an async helper:', function() {
    app.asyncHelper('a', function() {});
    app.asyncHelper('b', function() {});
    app._.helpers.async.should.have.property('a');
    app._.helpers.async.should.have.property('b');
  });

  it('should use an async helper:', function(cb) {
    app.pages('a.tmpl', {path: 'a.tmpl', content: '<%= lower(a) %>', locals: {a: 'BBB'}});
    app.asyncHelper('lower', function(str, next) {
      if (typeof next !== 'function') return str;
      next(null, str.toLowerCase());
    });

    var page = app.pages.getView('a.tmpl');
    app.render(page, function(err, view) {
      if (err) return cb(err);
      assert.equal(typeof view.content, 'string');
      assert.equal(view.content, 'bbb');
      cb();
    });
  });
});

describe('built-in helpers:', function() {
  describe('automatically generated helpers for default view types:', function() {
    beforeEach(function() {
      app = new App({rethrow: false});
      app.engine('md', require('engine-base'));
      app.engine('tmpl', require('engine-base'));
      app.create('partials', { viewType: 'partial' });
      app.create('pages');

      // parse front matter
      app.onLoad(/./, function(view, next) {
        matter.parse(view, next);
      });
    });

    it('should expose front matter to the `partial` helper.', function(cb) {
      app.partial('a.md', {content: '---\nname: "AAA"\n---\n<%= name %>', locals: {name: 'BBB'}});
      app.page('b.md', {path: 'b.md', content: 'foo <%= partial("a.md") %> bar'});

      app.render('b.md', function(err, res) {
        if (err) return cb(err);
        res.content.should.equal('foo AAA bar');
        cb();
      });
    });

    it('should use helper locals.', function(cb) {
      app.partial('abc.md', {content: '<%= name %>', locals: {name: 'BBB'}});
      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md", { name: "CCC" }) %> bar'});

      app.render('xyz.md', {name: 'DDD'}, function(err, res) {
        if (err) return cb(err);
        res.content.should.equal('foo CCC bar');
        cb();
      });
    });

    it('should use front matter data.', function(cb) {
      app.partial('abc.md', {content: '---\nname: "AAA"\n---\n<%= name %>'});
      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md") %> bar'});

      app.render('xyz.md', {name: 'DDD'}, function(err, res) {
        if (err) return cb(err);
        res.content.should.equal('foo AAA bar');
        cb();
      });
    });

    it('should prefer helper locals over front-matter', function(cb) {
      app.partial('abc.md', {content: '---\nname: "AAA"\n---\n<%= name %>', locals: {name: 'BBB'}});
      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md", { name: "CCC" }) %> bar'});

      app.render('xyz.md', {name: 'DDD'}, function(err, res) {
        if (err) return cb(err);
        res.content.should.equal('foo CCC bar');
        cb();
      });
    });

    it('should use partial locals:', function(cb) {
      app.partial('abc.md', {content: '<%= name %>', locals: {name: 'EEE'}});

      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md") %> bar'})
        .render({name: 'DDD'}, function(err, res) {
          if (err) return cb(err);
          res.content.should.equal('foo EEE bar');
          cb();
        });
    });

    it('should use locals from the `view.render` method:', function(cb) {
      app.partial('abc.md', {content: '<%= name %>', locals: {name: 'EEE'}});

      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md") %> bar'})
        .render({name: 'DDD'}, function(err, res) {
          if (err) return cb(err);

          res.content.should.equal('foo EEE bar');
          cb();
        });
    });

    it('should use locals from the `app.render` method:', function(cb) {
      app.partial('abc.md', {content: '<%= name %>'});
      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md") %> bar'});

      app.render('xyz.md', {name: 'DDD'}, function(err, res) {
        if (err) return cb(err);
        res.content.should.equal('foo DDD bar');
        cb();
      });
    });

    it('should use a `helperContext` function from app.options', function(cb) {
      app.option('helperContext', function(view, locals) {
        return { name: 'blah' };
      });

      app.partial('abc.md', {content: '<%= name %>'});
      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md") %> bar'});

      app.render('xyz.md', {name: 'DDD'}, function(err, res) {
        if (err) return cb(err);
        res.content.should.equal('foo blah bar');
        cb();
      });
    });

    it('should return an empty string when the partial is missing.', function(cb) {
      app.partial('abc.md', {content: '---\nname: "AAA"\n---\n<%= name %>', locals: {name: 'BBB'}});
      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("def.md", { name: "CCC" }) %> bar'});
      app.render('xyz.md', {name: 'DDD'}, function(err, res) {
        if (err) return cb(err);
        res.content.should.equal('foo  bar');
        cb();
      });
    });
  });

  describe('helper context:', function() {
    beforeEach(function() {
      app = new App({rethrow: false});
      app.engine(['tmpl', 'md'], require('engine-base'));
      app.create('partial', { viewType: 'partial' });
      app.create('page');

      // parse front matter
      app.onLoad(/./, function(view, next) {
        matter.parse(view, next);
      });
    });

    it('should prefer helper locals over view locals.', function(cb) {
      app.partial('abc.md', {content: '<%= name %>', name: 'BBB'});
      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md", { name: "CCC" }) %> bar'});

      app.render('xyz.md', {name: 'DDD'}, function(err, res) {
        if (err) return cb(err);
        res.content.should.equal('foo CCC bar');
        cb();
      });
    });

    it('should give preference to view locals over render locals.', function(cb) {
      app.partial('abc.md', {content: '<%= name %>', locals: {name: 'BBB'}});
      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md") %> bar'});

      var page = app.pages.getView('xyz.md');

      app.render(page, {name: 'DDD'}, function(err, res) {
        if (err) return cb(err);
        res.content.should.equal('foo BBB bar');
        cb();
      });
    });

    it('should use render locals when other locals are not defined.', function(cb) {
      app.partial('abc.md', {content: '<%= name %>'});
      app.page('xyz.md', {path: 'xyz.md', content: 'foo <%= partial("abc.md") %> bar'});

      app.render('xyz.md', {name: 'DDD'}, function(err, res) {
        if (err) return cb(err);
        res.content.should.equal('foo DDD bar');
        cb();
      });
    });
  });

  describe('user-defined engines:', function() {
    beforeEach(function() {
      app = new App({rethrow: false});
      app.create('partial', { viewType: 'partial' });
      app.create('page');

      // parse front matter
      app.onLoad(/./, function(view, next) {
        matter.parse(view, next);
      });
    });

    it('should use the `partial` helper with handlebars.', function(cb) {
      app.engine(['tmpl', 'md'], require('engine-base'));
      app.engine('hbs', handlebars);

      app.partial('title.hbs', {content: '<title>{{name}}</title>', locals: {name: 'BBB'}});
      app.page('a.hbs', {path: 'a.hbs', content: 'foo {{{partial "title.hbs" this}}} bar'});

      app.render('a.hbs', {name: 'Halle Nicole'}, function(err, res) {
        if (err) return cb(err);
        res.content.should.equal('foo <title>Halle Nicole</title> bar');
        cb();
      });
    });

    it('should use the `partial` helper with any engine.', function(cb) {
      app.engine('hbs', handlebars);
      app.engine('md', handlebars);
      app.engine('swig', swig);
      app.engine('tmpl', require('engine-base'));

      /**
       * Partial
       */
      
      app.partial('a.hbs', {
        content: '---\nname: "AAA"\n---\n<title>{{name}}</title>',
        locals: {
          name: 'BBB'
        }
      });

      /**
       * Pages
       */
      
      app.page('a.hbs', {
        path: 'a.hbs',
        content: '<title>{{author}}</title>',
        locals: {
          author: 'Halle Nicole'
        }
      });
      app.page('b.tmpl', {
        path: 'b.tmpl',
        content: '<title><%= author %></title>',
        locals: {
          author: 'Halle Nicole'
        }
      });
      app.page('d.swig', {
        path: 'd.swig',
        content: '<title>{{author}}</title>',
        locals: {
          author: 'Halle Nicole'
        }
      });
      app.page('e.swig', {
        path: 'e.swig',
        content: '<title>{{author}}</title>',
        locals: {
          author: 'Halle Nicole'
        }
      });
      app.page('f.hbs', {
        content: '<title>{{author}}</title>',
        locals: {
          author: 'Halle Nicole'
        }
      });
      app.page('g.md', {
        content: '---\nauthor: Brian Woodward\n---\n<title>{{author}}</title>',
        locals: {
          author: 'Halle Nicole'
        }
      });
      app.page('with-partial.hbs', {
        path: 'with-partial.hbs',
        content: '{{{partial "a.hbs" custom.locals}}}'
      });

      app.on('error', function(err) {
        cb(err);
      });

      var locals = {custom: {locals: {name: 'Halle Nicole' }}};
      app.render('a.hbs', locals, function(err, res) {
        if (err) {
          app.emit('error', err);
          return;
        }
        res.content.should.equal('<title>Halle Nicole</title>');
      });

      app.render('with-partial.hbs', locals, function(err, res) {
        if (err) {
          app.emit('error', err);
          return;
        }
        res.content.should.equal('<title>Halle Nicole</title>');
      });

      var page = app.pages.getView('g.md');
      locals.author = page.data.author || locals.author;
      page.render(locals, function(err, res) {
        if (err) {
          app.emit('error', err);
          return;
        }
        res.content.should.equal('<title>Brian Woodward</title>');
        cb(null, res.content);
      });
    });
  });
});

describe('helpers integration', function() {
  beforeEach(function() {
    app = new App();
    app.create('pages');
    app.engine('md', require('engine-base'));
  });

  describe('.helpers()', function() {
    it('should add helpers and use them in templates.', function(cb) {
      app.helpers({
        upper: function(str) {
          return str.toUpperCase();
        }
      });

      app.page('doc.md', {content: 'a <%= upper(name) %> b'})
        .render({name: 'Halle'}, function(err, res) {
          if (err) return cb(err);
          assert(res.content === 'a HALLE b');
          cb();
        });
    });
  });

  describe('helper options:', function() {
    it('should expose `this.options` to helpers:', function(cb) {
      app.helper('cwd', function(fp) {
        return path.join(this.options.cwd, fp);
      });

      app.option('one', 'two');
      app.option('cwd', 'foo/bar');
      app.page('doc.md', {content: 'a <%= cwd("baz") %> b'})
        .render(function(err, res) {
          if (err) return cb(err);
          assert(res.content === 'a foo/bar/baz b');
          cb();
        });
    });

    it('should pass helper options to helpers:', function(cb) {
      app.helper('cwd', function(fp) {
        return path.join(this.options.cwd, fp);
      });

      app.option('helper.cwd', 'foo/bar');
      app.option('helper.whatever', '...');

      app.page('doc.md', {content: 'a <%= cwd("baz") %> b'})
        .render(function(err, res) {
          if (err) return cb(err);
          assert(res.content === 'a foo/bar/baz b');
          cb();
        });
    });
  });

  describe('options.helpers', function() {
    it('should register helpers passed on the options:', function(cb) {
      app.option({
        helpers: {
          upper: function(str) {
            return str.toUpperCase();
          },
          foo: function(str) {
            return 'foo' + str;
          }
        }
      });

      app.page('doc.md', {content: 'a <%= upper(name) %> <%= foo("bar") %> b'})
        .render({name: 'Halle'}, function(err, res) {
          if (err) return cb(err);
          assert(res.content === 'a HALLE foobar b');
          cb();
        });
    });
  });

  describe('options.helpers', function() {
    it('should add helpers and use them in templates.', function(cb) {
      app.options.helpers = {
        upper: function(str) {
          return str.toUpperCase();
        },
        foo: function(str) {
          return 'foo' + str;
        }
      };

      app.page('doc.md', {content: 'a <%= upper(name) %> b'})
        .render({name: 'Halle'}, function(err, res) {
          if (err) return cb(err);
          assert(res.content === 'a HALLE b');
          cb();
        });
    });
  });
});

describe('collection helpers', function() {
  beforeEach(function() {
    app = new App();
    app.create('posts');
    app.create('pages', {engine: 'hbs'});
    app.create('partials', {viewType: 'partial', engine: 'hbs'});
    app.create('snippet', {viewType: 'partial'});
    app.engine('hbs', require('engine-handlebars'));
    app.helper('log', function(ctx) {
      console.log(ctx);
    });
  });

  describe('plural', function() {
    it('should get the given collection', function(cb) {
      app.post('a.hbs', {content: 'foo'});
      app.post('b.hbs', {content: 'bar'});
      app.post('c.hbs', {content: 'baz'});

      app.partial('list.hbs', {
        content: '{{#posts}}{{#each items}}{{content}}{{/each}}{{/posts}}'
      });

      app.page('index.hbs', {
        content: '{{> list.hbs }}'
      })
        .render(function(err, res) {
          if (err) return cb(err);
          assert(res.content === 'foobarbaz');
          cb();
        });
    });
  });

  describe('single', function() {
    it('should get a view from an unspecified collection', function(cb) {
      app.post('a.hbs', {content: 'post-a'});
      app.post('b.hbs', {content: 'post-b'});

      var one = app.page('one', {content: '{{view "a.hbs"}}'})
        .compile()
        .fn();

      var two = app.page('two', {content: '{{view "b.hbs"}}'})
        .compile()
        .fn();

      assert(one === 'post-a');
      assert(two === 'post-b');
      cb();
    });

    it('should return an empty string if not found', function(cb) {
      var one = app.page('one', {content: '{{view "foo.hbs"}}'})
        .compile()
        .fn();
      assert(one === '');
      cb();
    });

    it('should handle engine errors', function(cb) {
      app.post('foo.hbs', {content: '{{one "two"}}'});
      app.page('one', {content: '{{posts "foo.hbs"}}'})
        .render(function(err) {
          assert(err);
          assert(typeof err === 'object');
          assert(typeof err.message === 'string');
          assert(/Missing helper: "one"/.test(err.message));
          cb();
        });
    });

    it('should handle engine errors2', function(cb) {
      app.engine('tmpl', require('engine-base'));
      app.create('foo', {engine: 'tmpl'});
      app.create('bar', {engine: 'tmpl'});

      app.create('foo', {viewType: 'partial'});
      app.foo('foo.tmpl', {path: 'foo.tmpl', content: '<%= blah.bar %>'});
      app.bar('one.tmpl', {content: '<%= foo("foo.tmpl") %>'})
        .render(function(err) {
          assert(err);
          assert(typeof err === 'object');
          assert(/blah is not defined/.test(err.message));
          cb();
        });
    });

    it('should work with non-handlebars engine', function(cb) {
      app.engine('tmpl', require('engine-base'));
      app.create('foo', {engine: 'tmpl'});
      app.create('bar', {engine: 'tmpl'});

      app.foo('a.tmpl', {content: 'foo-a'});
      app.foo('b.tmpl', {content: 'foo-b'});

      var one = app.bar('one', {content: '<%= view("a.tmpl") %>'})
        .compile()
        .fn();

      var two = app.bar('two', {content: '<%= view("b.tmpl") %>'})
        .compile()
        .fn();

      assert(one === 'foo-a');
      assert(two === 'foo-b');
      cb();
    });

    it('should get a specific view from the given collection', function(cb) {
      app.post('a.hbs', {content: 'post-a'});
      app.post('b.hbs', {content: 'post-b'});
      app.post('c.hbs', {content: 'post-c'});
      app.page('a.hbs', {content: 'page-a'});
      app.page('b.hbs', {content: 'page-b'});
      app.page('c.hbs', {content: 'page-c'});

      var one = app.page('one', {content: '{{view "a.hbs" "posts"}}'})
        .compile()
        .fn();

      var two = app.page('two', {content: '{{view "b.hbs" "pages"}}'})
        .compile()
        .fn();

      assert(one === 'post-a');
      assert(two === 'page-b');
      cb();
    });
  });
});
