require('mocha');
var should = require('should');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var es = require('event-stream');
var Stream = require('stream');
var support = require('./support');
var App = support.resolve();
var Item = App.Item;
var item;

describe('Item', function() {
  describe('instance', function() {
    it('should create an instance of Item:', function() {
      item = new Item();
      assert(item instanceof Item);
    });

    it('should instantiate without new:', function() {
      item = Item();
      assert(item instanceof Item);
    });

    it('inspect should not double name `Stream` when ctor is `Stream`', function(done) {
      var val = new Stream();
      item = new Item({contents: val});
      done();
    });
  });

  describe('static methods', function() {
    it('should expose `extend`:', function() {
      assert(typeof Item.extend === 'function');
    });
  });

  describe('prototype methods', function() {
    beforeEach(function() {
      item = new Item();
    });

    it('should expose `set`:', function() {
      assert(typeof item.set === 'function');
    });
    it('should expose `get`:', function() {
      assert(typeof item.get === 'function');
    });
    it('should expose `del`:', function() {
      assert(typeof item.del === 'function');
    });
    it('should expose `define`:', function() {
      assert(typeof item.define === 'function');
    });
    it('should expose `visit`:', function() {
      assert(typeof item.visit === 'function');
    });
  });

  describe('properties', function() {
    it('should expose an `options` property', function() {
      item = new Item({});
      assert.deepEqual(item.options, {});
      assert(item.hasOwnProperty('options'));
    });

    it('should add `options` when passed on the constructor', function() {
      item = new Item({options: {foo: 'bar'}});
      assert(item.options.foo === 'bar');
    });

    it('should expose a `data` property', function() {
      item = new Item({app: {}});
      assert.deepEqual(item.data, {});
      assert(item.hasOwnProperty('data'));
    });

    it('should add `data` when passed on the constructor', function() {
      item = new Item({data: {foo: 'bar'}});
      assert(item.data.foo === 'bar');
    });

    it('should add `locals` when passed on the constructor', function() {
      item = new Item({locals: {foo: 'bar'}});
      assert(item.locals.foo === 'bar');
    });
  });

  describe('set', function() {
    it('should set properties on the object', function() {
      item = new Item();
      item.set('foo', 'bar');
      assert.equal(item.foo, 'bar');
    });
  });

  describe('get', function() {
    it('should get properties from the object', function() {
      item = new Item();
      item.set('foo', 'bar');
      assert.equal(item.get('foo'), 'bar');
    });
  });

  describe('cwd', function() {
    it('should get properties from the object', function() {
      item = new Item({cwd: 'test/fixtures'});
      assert(item.cwd === 'test/fixtures');
    });
  });

  describe('clone', function() {
    it('should clone the item:', function() {
      item = new Item({content: 'foo'});
      item.set({path: 'foo/bar'});
      item.set('options.one', 'two');
      var clone = item.clone();
      assert(clone.contents);
      clone.set('baz', 'quux');
      clone.set('options.three', 'four');
      assert.equal(clone.get('foo'), item.get('foo'));
      assert(clone.get('baz') === 'quux');
      assert(!item.get('baz'));
      // not deep cloned
      assert(clone.get('options.three') === 'four');
      assert(item.get('options.three') === 'four');
    });

    it('should deep clone the entire object', function() {
      item = new Item({content: 'foo'});
      item.set({path: 'foo/bar'});
      item.set('options.one', 'two');
      var clone = item.clone({deep: true});
      clone.set('options.three', 'four');
      assert(item.get('options.one') === 'two');
      assert(clone.get('options.one') === 'two');
      assert(clone.get('options.three') === 'four');
      assert(!item.get('options.three'));
    });
  });

  describe('visit', function() {
    it('should visit all properties on an object and call the specified method', function() {
      item = new Item();
      var obj = {
        foo: 'bar',
        bar: 'baz',
        baz: 'bang'
      };
      item.visit('set', obj);
      assert.equal(item.get('foo'), 'bar');
      assert.equal(item.get('bar'), 'baz');
      assert.equal(item.get('baz'), 'bang');
    });

    it('should visit all properties on all objects in an array and call the specified method', function() {
      item = new Item();
      var arr = [{foo: 'bar', bar: 'baz', baz: 'bang'}];
      item.visit('set', arr);
      assert.equal(item.get('foo'), 'bar');
      assert.equal(item.get('bar'), 'baz');
      assert.equal(item.get('baz'), 'bang');
    });
  });
});

/**
 * The following unit tests are from Vinyl
 * Since we inherit vinyl in Item, we need
 * to ensure that these still pass.
 */

describe('Item', function() {
  describe('isVinyl()', function() {
    it('should return true on a vinyl object', function(done) {
      item = new Item();
      assert(Item.isVinyl(item) === true);
      done();
    });
    it('should return false on a normal object', function(done) {
      assert(Item.isVinyl({}) === false);
      done();
    });
    it('should return false on a null object', function(done) {
      assert(Item.isVinyl({}) === false);
      done();
    });
  });

  describe('constructor()', function() {
    it('should default cwd to process.cwd', function(done) {
      item = new Item();
      item.cwd.should.equal(process.cwd());
      done();
    });

    it('should default base to cwd', function(done) {
      var cwd = '/';
      item = new Item({cwd: cwd});
      item.base.should.equal(cwd);
      done();
    });

    it('should default base to cwd even when none is given', function(done) {
      item = new Item();
      item.base.should.equal(process.cwd());
      done();
    });

    it('should default path to null', function(done) {
      item = new Item();
      should.not.exist(item.path);
      done();
    });

    it('should default history to []', function(done) {
      item = new Item();
      item.history.should.eql([]);
      done();
    });

    it('should default stat to null', function(done) {
      item = new Item();
      should.not.exist(item.stat);
      done();
    });

    it('should default contents to null', function(done) {
      item = new Item();
      should.not.exist(item.contents);
      done();
    });

    it('should set base to given value', function(done) {
      var val = '/';
      item = new Item({base: val});
      item.base.should.equal(val);
      done();
    });

    it('should set cwd to given value', function(done) {
      var val = '/';
      item = new Item({cwd: val});
      item.cwd.should.equal(val);
      done();
    });

    it('should set path to given value', function(done) {
      var val = '/test.coffee';
      item = new Item({path: val});
      item.path.should.equal(val);
      item.history.should.eql([val]);
      done();
    });

    it('should set history to given value', function(done) {
      var val = '/test.coffee';
      item = new Item({history: [val]});
      item.path.should.equal(val);
      item.history.should.eql([val]);
      done();
    });

    it('should set stat to given value', function(done) {
      var val = {};
      item = new Item({stat: val});
      item.stat.should.equal(val);
      done();
    });

    it('should set contents to given value', function(done) {
      var val = new Buffer('test');
      item = new Item({contents: val});
      item.contents.should.equal(val);
      done();
    });
  });

  describe('isBuffer()', function() {
    it('should return true when the contents are a Buffer', function(done) {
      var val = new Buffer('test');
      item = new Item({contents: val});
      item.isBuffer().should.equal(true);
      done();
    });

    it('should return false when the contents are a Stream', function(done) {
      var val = new Stream();
      var item = new Item({contents: val});
      item.isBuffer().should.equal(false);
      done();
    });

    it('should return false when the contents are a null', function(done) {
      var item = new Item({contents: null});
      item.isBuffer().should.equal(false);
      done();
    });
  });

  describe('isStream()', function() {
    it('should return false when the contents are a Buffer', function(done) {
      var val = new Buffer('test');
      var item = new Item({contents: val});
      item.isStream().should.equal(false);
      done();
    });

    it('should return true when the contents are a Stream', function(done) {
      var val = new Stream();
      var item = new Item({contents: val});
      item.isStream().should.equal(true);
      done();
    });

    it('should return false when the contents are a null', function(done) {
      var item = new Item({contents: null});
      item.isStream().should.equal(false);
      done();
    });
  });

  describe('isNull()', function() {
    it('should return false when the contents are a Buffer', function(done) {
      var val = new Buffer('test');
      var item = new Item({contents: val});
      item.isNull().should.equal(false);
      done();
    });

    it('should return false when the contents are a Stream', function(done) {
      var val = new Stream();
      var item = new Item({contents: val});
      item.isNull().should.equal(false);
      done();
    });

    it('should return true when the contents are a null', function(done) {
      var item = new Item({contents: null});
      item.isNull().should.equal(true);
      done();
    });
  });

  describe('isDirectory()', function() {
    var fakeStat = {
      isDirectory: function() {
        return true;
      }
    };

    it('should return false when the contents are a Buffer', function(done) {
      var val = new Buffer('test');
      var item = new Item({contents: val, stat: fakeStat});
      item.isDirectory().should.equal(false);
      done();
    });

    it('should return false when the contents are a Stream', function(done) {
      var val = new Stream();
      var item = new Item({contents: val, stat: fakeStat});
      item.isDirectory().should.equal(false);
      done();
    });

    it('should return true when the contents are a null', function(done) {
      var item = new Item({contents: null, stat: fakeStat});
      item.isDirectory().should.equal(true);
      done();
    });
  });

  describe('clone()', function() {
    it('should copy all attributes over with Buffer', function(done) {
      var options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: new Buffer('test')
      };
      var item = new Item(options);
      var item2 = item.clone();

      item2.should.not.equal(item, 'refs should be different');
      item2.cwd.should.equal(item.cwd);
      item2.base.should.equal(item.base);
      item2.path.should.equal(item.path);
      item2.contents.should.not.equal(item.contents, 'buffer ref should be different');
      item2.contents.toString('utf8').should.equal(item.contents.toString('utf8'));
      done();
    });

    it('should copy buffer\'s reference with option contents: false', function(done) {
      var options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.js',
        contents: new Buffer('test')
      };

      var item = new Item(options);

      var copy1 = item.clone({ contents: false });
      copy1.contents.should.equal(item.contents);

      var copy2 = item.clone({});
      copy2.contents.should.not.equal(item.contents);

      var copy3 = item.clone({ contents: 'any string' });
      copy3.contents.should.not.equal(item.contents);

      done();
    });

    it('should copy all attributes over with Stream', function(done) {
      var contents = new Stream.PassThrough();
      var options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: contents
      };
      var item = new Item(options);
      var item2 = item.clone();

      contents.write(new Buffer('wa'));

      process.nextTick(function() {
        contents.write(new Buffer('dup'));
        contents.end();
      });

      item2.should.not.equal(item, 'refs should be different');
      item2.cwd.should.equal(item.cwd);
      item2.base.should.equal(item.base);
      item2.path.should.equal(item.path);
      item2.contents.should.not.equal(item.contents, 'stream ref should not be the same');
      item.contents.pipe(es.wait(function(err, data) {
        if (err) return done(err);
        item2.contents.pipe(es.wait(function(err, data2) {
          if (err) return done(err);
          data2.should.not.equal(data, 'stream contents ref should not be the same');
          data2.should.eql(data, 'stream contents should be the same');
        }));
      }));
      done();
    });

    it('should copy all attributes over with null', function(done) {
      var options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: null
      };
      var item = new Item(options);
      var item2 = item.clone();

      item2.should.not.equal(item, 'refs should be different');
      item2.cwd.should.equal(item.cwd);
      item2.base.should.equal(item.base);
      item2.path.should.equal(item.path);
      should.not.exist(item2.contents);
      done();
    });

    it('should properly clone the `stat` property', function(done) {
      var options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.js',
        contents: new Buffer('test'),
        stat: fs.statSync(__filename)
      };

      var item = new Item(options);
      var copy = item.clone();

      assert(copy.stat.isFile());
      assert(!copy.stat.isDirectory());
      done();
    });

    it('should properly clone the `history` property', function(done) {
      var options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.js',
        contents: new Buffer('test'),
        stat: fs.statSync(__filename)
      };

      var item = new Item(options);
      var copy = item.clone();

      copy.history[0].should.equal(options.path);
      copy.path = 'lol';
      item.path.should.not.equal(copy.path);
      done();
    });

    it('should copy custom properties', function(done) {
      var options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: null
      };

      var item = new Item(options);
      item.custom = { a: 'custom property' };
      var item2 = item.clone();

      item2.should.not.equal(item, 'refs should be different');
      item2.cwd.should.equal(item.cwd);
      item2.base.should.equal(item.base);
      item2.path.should.equal(item.path);
      item2.custom.should.equal(item.custom);
      item2.custom.a.should.equal(item.custom.a);

      done();
    });

    it('should copy history', function(done) {
      var options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: null
      };

      var item = new Item(options);
      item.path = '/test/test.js';
      item.path = '/test/test-938di2s.js';
      var item2 = item.clone();

      item2.history.should.eql([
        '/test/test.coffee',
        '/test/test.js',
        '/test/test-938di2s.js'
      ]);
      item2.history.should.not.equal([
        '/test/test.coffee',
        '/test/test.js',
        '/test/test-938di2s.js'
      ]);
      item2.path.should.eql('/test/test-938di2s.js');

      done();
    });

    it('should copy all attributes deeply', function(done) {
      var options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: null
      };

      var item = new Item(options);
      item.custom = { a: 'custom property' };

      var item2 = item.clone(true);
      item2.custom.should.eql(item.custom);
      item2.custom.should.not.equal(item.custom);
      item2.custom.a.should.equal(item.custom.a);

      var item3 = item.clone({ deep: true });
      item3.custom.should.eql(item.custom);
      item3.custom.should.not.equal(item.custom);
      item3.custom.a.should.equal(item.custom.a);

      var item4 = item.clone(false);
      item4.custom.should.eql(item.custom);
      item4.custom.should.equal(item.custom);
      item4.custom.a.should.equal(item.custom.a);

      var item5 = item.clone({ deep: false });
      item5.custom.should.eql(item.custom);
      item5.custom.should.equal(item.custom);
      item5.custom.a.should.equal(item.custom.a);

      done();
    });
  });

  describe('pipe()', function() {
    it('should write to stream with Buffer', function(done) {
      var options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: new Buffer('test')
      };
      var item = new Item(options);
      var stream = new Stream.PassThrough();
      stream.on('data', function(chunk) {
        should.exist(chunk);
        (chunk instanceof Buffer).should.equal(true, 'should write as a buffer');
        chunk.toString('utf8').should.equal(options.contents.toString('utf8'));
      });
      stream.on('end', function() {
        done();
      });
      var ret = item.pipe(stream);
      ret.should.equal(stream, 'should return the stream');
    });

    it('should pipe to stream with Stream', function(done) {
      var testChunk = new Buffer('test');
      var options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: new Stream.PassThrough()
      };
      var item = new Item(options);
      var stream = new Stream.PassThrough();
      stream.on('data', function(chunk) {
        should.exist(chunk);
        (chunk instanceof Buffer).should.equal(true, 'should write as a buffer');
        chunk.toString('utf8').should.equal(testChunk.toString('utf8'));
        done();
      });
      var ret = item.pipe(stream);
      ret.should.equal(stream, 'should return the stream');

      item.contents.write(testChunk);
    });

    it('should do nothing with null', function(done) {
      var options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: null
      };
      var item = new Item(options);
      var stream = new Stream.PassThrough();
      stream.on('data', function() {
        throw new Error('should not write');
      });
      stream.on('end', function() {
        done();
      });
      var ret = item.pipe(stream);
      ret.should.equal(stream, 'should return the stream');
    });

    it('should write to stream with Buffer', function(done) {
      var options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: new Buffer('test')
      };
      var item = new Item(options);
      var stream = new Stream.PassThrough();
      stream.on('data', function(chunk) {
        should.exist(chunk);
        (chunk instanceof Buffer).should.equal(true, 'should write as a buffer');
        chunk.toString('utf8').should.equal(options.contents.toString('utf8'));
        done();
      });
      stream.on('end', function() {
        throw new Error('should not end');
      });
      var ret = item.pipe(stream, {end: false});
      ret.should.equal(stream, 'should return the stream');
    });

    it('should pipe to stream with Stream', function(done) {
      var testChunk = new Buffer('test');
      var options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: new Stream.PassThrough()
      };
      var item = new Item(options);
      var stream = new Stream.PassThrough();
      stream.on('data', function(chunk) {
        should.exist(chunk);
        (chunk instanceof Buffer).should.equal(true, 'should write as a buffer');
        chunk.toString('utf8').should.equal(testChunk.toString('utf8'));
        done();
      });
      stream.on('end', function() {
        throw new Error('should not end');
      });
      var ret = item.pipe(stream, {end: false});
      ret.should.equal(stream, 'should return the stream');

      item.contents.write(testChunk);
    });

    it('should do nothing with null', function(done) {
      var options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: null
      };
      var item = new Item(options);
      var stream = new Stream.PassThrough();
      stream.on('data', function() {
        throw new Error('should not write');
      });
      stream.on('end', function() {
        throw new Error('should not end');
      });
      var ret = item.pipe(stream, {end: false});
      ret.should.equal(stream, 'should return the stream');
      process.nextTick(done);
    });
  });

  describe('inspect()', function() {
    it('should return correct format when no contents and no path', function(done) {
      var item = new Item();
      item.inspect().should.equal('<Item >');
      done();
    });

    it('should return correct format when Buffer and no path', function(done) {
      var val = new Buffer('test');
      var item = new Item({
        contents: val
      });
      item.inspect().should.equal('<Item <Buffer 74 65 73 74>>');
      done();
    });

    it('should return correct format when Buffer and relative path', function(done) {
      var val = new Buffer('test');
      var item = new Item({
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: val
      });
      item.inspect().should.equal('<Item "test.coffee" <Buffer 74 65 73 74>>');
      done();
    });

    it('should return correct format when Buffer and only path and no base', function(done) {
      var val = new Buffer('test');
      var item = new Item({
        cwd: '/',
        path: '/test/test.coffee',
        contents: val
      });
      delete item.base;
      item.inspect().should.equal('<Item "/test/test.coffee" <Buffer 74 65 73 74>>');
      done();
    });

    it('should return correct format when Stream and relative path', function(done) {
      var item = new Item({
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: new Stream.PassThrough()
      });
      item.inspect().should.equal('<Item "test.coffee" <PassThroughStream>>');
      done();
    });

    it('should return correct format when null and relative path', function(done) {
      var item = new Item({
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: null
      });
      item.inspect().should.equal('<Item "test.coffee">');
      done();
    });
  });

  describe('contents get/set', function() {
    it('should work with Buffer', function(done) {
      var val = new Buffer('test');
      var item = new Item();
      item.contents = val;
      item.contents.should.equal(val);
      done();
    });

    it('should work with Stream', function(done) {
      var val = new Stream.PassThrough();
      var item = new Item();
      item.contents = val;
      item.contents.should.equal(val);
      done();
    });

    it('should work with null', function(done) {
      var val = null;
      var item = new Item();
      item.contents = val;
      (item.contents === null).should.equal(true);
      done();
    });

    it('should work with string', function(done) {
      var val = 'test';
      var item = new Item();
      item.contents = val;
      item.contents.should.deepEqual(new Buffer(val));
      done();
    });
  });

  describe('relative get/set', function() {
    it('should error on set', function(done) {
      var item = new Item();
      try {
        item.relative = 'test';
      } catch (err) {
        should.exist(err);
        done();
      }
    });

    it('should error on get when no base', function(done) {
      var item = new Item();
      delete item.base;
      try {
        item.relative;
      } catch (err) {
        should.exist(err);
        done();
      }
    });

    it('should error on get when no path', function(done) {
      var item = new Item();
      try {
        item.relative;
      } catch (err) {
        should.exist(err);
        done();
      }
    });

    it('should return a relative path from base', function(done) {
      var item = new Item({
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee'
      });
      item.relative.should.equal('test.coffee');
      done();
    });

    it('should return a relative path from cwd', function(done) {
      var item = new Item({
        cwd: '/',
        path: '/test/test.coffee'
      });
      item.relative.should.equal(path.join('test', 'test.coffee'));
      done();
    });
  });

  describe('dirname get/set', function() {
    it('should error on get when no path', function(done) {
      var item = new Item();
      try {
        item.dirname;
      } catch (err) {
        should.exist(err);
        done();
      }
    });

    it('should return the dirname of the path', function(done) {
      var item = new Item({
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee'
      });
      item.dirname.should.equal('/test');
      done();
    });

    it('should error on set when no path', function(done) {
      var item = new Item();
      try {
        item.dirname = '/test';
      } catch (err) {
        should.exist(err);
        done();
      }
    });

    it('should set the dirname of the path', function(done) {
      var item = new Item({
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee'
      });
      item.dirname = '/test/foo';
      item.path.should.equal('/test/foo/test.coffee');
      done();
    });
  });

  describe('basename get/set', function() {
    it('should error on get when no path', function(done) {
      item = new Item();
      try {
        item.basename;
      } catch (err) {
        should.exist(err);
        done();
      }
    });

    it('should return the basename of the path', function(done) {
      item = new Item({
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee'
      });
      item.basename.should.equal('test.coffee');
      done();
    });

    it('should error on set when no path', function(done) {
      item = new Item();
      try {
        item.basename = 'test.coffee';
      } catch (err) {
        should.exist(err);
        done();
      }
    });

    it('should set the basename of the path', function(done) {
      item = new Item({
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee'
      });
      item.basename = 'foo.png';
      item.path.should.equal('/test/foo.png');
      done();
    });
  });

  describe('extname get/set', function() {
    it('should error on get when no path', function(done) {
      item = new Item();
      try {
        item.extname;
      } catch (err) {
        should.exist(err);
        done();
      }
    });

    it('should return the extname of the path', function(done) {
      item = new Item({
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee'
      });
      item.extname.should.equal('.coffee');
      done();
    });

    it('should error on set when no path', function(done) {
      item = new Item();
      try {
        item.extname = '.coffee';
      } catch (err) {
        should.exist(err);
        done();
      }
    });

    it('should set the extname of the path', function(done) {
      item = new Item({
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee'
      });
      item.extname = '.png';
      item.path.should.equal('/test/test.png');
      done();
    });
  });

  describe('path get/set', function() {

    it('should record history when instantiation', function() {
      var item = new Item({
        cwd: '/',
        path: '/test/test.coffee'
      });

      item.path.should.eql('/test/test.coffee');
      item.history.should.eql(['/test/test.coffee']);
    });

    it('should record history when path change', function() {
      var item = new Item({
        cwd: '/',
        path: '/test/test.coffee'
      });

      item.path = '/test/test.js';
      item.path.should.eql('/test/test.js');
      item.history.should.eql(['/test/test.coffee', '/test/test.js']);

      item.path = '/test/test.coffee';
      item.path.should.eql('/test/test.coffee');
      item.history.should.eql(['/test/test.coffee', '/test/test.js', '/test/test.coffee']);
    });

    it('should not record history when set the same path', function() {
      var item = new Item({
        cwd: '/',
        path: '/test/test.coffee'
      });

      item.path = '/test/test.coffee';
      item.path = '/test/test.coffee';
      item.path.should.eql('/test/test.coffee');
      item.history.should.eql(['/test/test.coffee']);

      // ignore when set empty string
      item.path = '';
      item.path.should.eql('/test/test.coffee');
      item.history.should.eql(['/test/test.coffee']);
    });

    it('should throw when set path null in constructor', function() {
      (function() {
        Item({
          cwd: '/',
          path: null
        });
      }).should.throw('path should be string');
    });

    it('should throw when set path null', function() {
      item = new Item({
        cwd: '/',
        path: 'foo'
      });

      (function() {
        item.path = null;
      }).should.throw('path should be string');
    });
  });
});
