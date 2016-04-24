'use strict';

var assemble = require('..');
var assert = require('assert');
var should = require('should');
var app;

describe('toStream()', function() {
  beforeEach(function() {
    app = assemble();
    app.create('pages');
    app.page('a', {content: 'this is A'});
    app.page('b', {content: 'this is B'});
    app.page('c', {content: 'this is C'});

    app.create('posts');
    app.post('x', {content: 'this is X'});
    app.post('y', {content: 'this is Y'});
    app.post('z', {content: 'this is Z'});
  });

  it('should return a stream', function(cb) {
    var stream = app.toStream();
    should.exist(stream);
    should.exist(stream.on);
    cb();
  });

  it('should return a stream for a collection', function(cb) {
    var stream = app.toStream('pages');
    should.exist(stream);
    should.exist(stream.on);
    cb();
  });

  it('should stack handle multiple collections', function(cb) {
    var files = [];
    app.toStream('pages')
      .pipe(app.toStream('posts'))
      .on('data', function(file) {
        files.push(file);
      })
      .on('end', function() {
        assert.equal(files.length, 6);
        cb();
      });
  });

  it('should push each item in the collection into the stream', function(cb) {
    var files = [];
    app.toStream('pages')
      .on('error', cb)
      .on('data', function(file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        files.push(file.path);
      })
      .on('end', function() {
        assert.equal(files.length, 3);
        cb();
      });
  });
});