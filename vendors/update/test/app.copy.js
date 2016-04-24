require('mocha');
var path = require('path');
var assert = require('assert');
var rimraf = require('rimraf');
var App = require('..');
var app;

var fixtures = path.join(__dirname, 'fixtures/copy/*.txt');
var actual = path.join(__dirname, 'actual');

describe('copy()', function() {
  beforeEach(function(done) {
    rimraf(actual, done);
    app = new App();
  });

  afterEach(function(done) {
    rimraf(actual, done);
  });

  describe('streams', function() {
    it('should copy files', function(done) {
      app.copy(fixtures, path.join(__dirname, 'actual'))
        .on('error', done)
        .on('data', function(file) {
          assert.equal(typeof file, 'object');
        })
        .on('end', done);
    });
  });
});
