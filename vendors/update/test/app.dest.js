var spies = require('./support/spy');
var chmodSpy = spies.chmodSpy;
var statSpy = spies.statSpy;

require('mocha');
var should = require('should');
var assert = require('assert');
var App = require('..');
var app;

var path = require('path');
var fs = require('graceful-fs');
var rimraf = require('rimraf');

var bufferStream;
var bufEqual = require('buffer-equal');
var through = require('through2');
var File = require('vinyl');

var actual = path.join(__dirname, 'actual');

var wipeOut = function(cb) {
  app = new App();
  rimraf(path.join(__dirname, 'actual/'), cb);
  spies.setError('false');
  statSpy.reset();
  chmodSpy.reset();
};

var dataWrap = function(fn) {
  return function(data, enc, cb) {
    fn(data);
    cb();
  };
};

var realMode = function(n) {
  return n & 07777;
};

describe('dest stream', function() {
  beforeEach(wipeOut);
  afterEach(wipeOut);

  it('should explode on invalid folder (empty)', function(done) {
    var stream;
    try {
      stream = app.dest();
    } catch (err) {
      assert(err && typeof err === 'object');
      should.not.exist(stream);
      done();
    }
  });

  it('should explode on invalid folder (empty string)', function(done) {
    var stream;
    try {
      stream = app.dest('');
    } catch (err) {
      assert(err && typeof err === 'object');
      should.not.exist(stream);
      done();
    }
  });

  it('should pass through writes with cwd', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');

    var expectedFile = new File({
      base: __dirname,
      cwd: __dirname,
      path: inputPath,
      contents: null
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      done();
    };

    var stream = app.dest('./actual/', {cwd: __dirname});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

  it('should pass through writes with default cwd', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');

    var expectedFile = new File({
      base: __dirname,
      cwd: __dirname,
      path: inputPath,
      contents: null
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      done();
    };

    var stream = app.dest(path.join(__dirname, 'actual/'));

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

  it('should not write null files', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');
    var inputBase = path.join(__dirname, 'fixtures/vinyl/');
    var expectedPath = path.join(__dirname, 'actual/test.coffee');
    var expectedCwd = __dirname;
    var expectedBase = path.join(__dirname, 'actual');

    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: null
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      buffered[0].cwd.should.equal(expectedCwd, 'cwd should have changed');
      buffered[0].base.should.equal(expectedBase, 'base should have changed');
      buffered[0].path.should.equal(expectedPath, 'path should have changed');
      fs.existsSync(expectedPath).should.equal(false);
      done();
    };

    var stream = app.dest('./actual/', {cwd: __dirname});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

  it('should write buffer files to the right folder with relative cwd', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');
    var inputBase = path.join(__dirname, 'fixtures/vinyl/');
    var expectedPath = path.join(__dirname, 'actual/test.coffee');
    var expectedCwd = __dirname;
    var expectedBase = path.join(__dirname, 'actual');
    var expectedContents = fs.readFileSync(inputPath);

    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: expectedContents
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      buffered[0].cwd.should.equal(expectedCwd, 'cwd should have changed');
      buffered[0].base.should.equal(expectedBase, 'base should have changed');
      buffered[0].path.should.equal(expectedPath, 'path should have changed');
      fs.existsSync(expectedPath).should.equal(true);
      bufEqual(fs.readFileSync(expectedPath), expectedContents).should.equal(true);
      done();
    };

    var stream = app.dest('./actual/', {cwd: path.relative(process.cwd(), __dirname)});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

  it('should write buffer files to the right folder with function and relative cwd', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');
    var inputBase = path.join(__dirname, 'fixtures/vinyl/');
    var expectedPath = path.join(__dirname, 'actual/test.coffee');
    var expectedCwd = __dirname;
    var expectedBase = path.join(__dirname, 'actual');
    var expectedContents = fs.readFileSync(inputPath);

    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: expectedContents
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      buffered[0].cwd.should.equal(expectedCwd, 'cwd should have changed');
      buffered[0].base.should.equal(expectedBase, 'base should have changed');
      buffered[0].path.should.equal(expectedPath, 'path should have changed');
      fs.existsSync(expectedPath).should.equal(true);
      bufEqual(fs.readFileSync(expectedPath), expectedContents).should.equal(true);
      done();
    };

    var stream = app.dest(function(file){
      should.exist(file);
      file.should.equal(expectedFile);
      return './actual';
    }, {cwd: path.relative(process.cwd(), __dirname)});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

  it('should write buffer files to the right folder', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');
    var inputBase = path.join(__dirname, 'fixtures/vinyl/');
    var expectedPath = path.join(__dirname, 'actual/test.coffee');
    var expectedContents = fs.readFileSync(inputPath);
    var expectedCwd = __dirname;
    var expectedBase = path.join(__dirname, 'actual');
    var expectedMode = 0655;

    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: expectedContents,
      stat: {
        mode: expectedMode
      }
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      buffered[0].cwd.should.equal(expectedCwd, 'cwd should have changed');
      buffered[0].base.should.equal(expectedBase, 'base should have changed');
      buffered[0].path.should.equal(expectedPath, 'path should have changed');
      fs.existsSync(expectedPath).should.equal(true);
      bufEqual(fs.readFileSync(expectedPath), expectedContents).should.equal(true);
      realMode(fs.lstatSync(expectedPath).mode).should.equal(expectedMode);
      done();
    };

    var stream = app.dest('./actual/', {cwd: __dirname});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

  it('should write streaming files to the right folder', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');
    var inputBase = path.join(__dirname, 'fixtures/vinyl/');
    var expectedPath = path.join(__dirname, 'actual/test.coffee');
    var expectedContents = fs.readFileSync(inputPath);
    var expectedCwd = __dirname;
    var expectedBase = path.join(__dirname, 'actual');
    var expectedMode = 0655;

    var contentStream = through.obj();
    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: contentStream,
      stat: {
        mode: expectedMode
      }
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      buffered[0].cwd.should.equal(expectedCwd, 'cwd should have changed');
      buffered[0].base.should.equal(expectedBase, 'base should have changed');
      buffered[0].path.should.equal(expectedPath, 'path should have changed');
      fs.existsSync(expectedPath).should.equal(true);
      bufEqual(fs.readFileSync(expectedPath), expectedContents).should.equal(true);
      realMode(fs.lstatSync(expectedPath).mode).should.equal(expectedMode);
      done();
    };

    var stream = app.dest('./actual/', {cwd: __dirname});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(expectedFile);
    setTimeout(function(){
      contentStream.write(expectedContents);
      contentStream.end();
    }, 100);
    stream.end();
  });

  it('should write directories to the right folder', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test');
    var inputBase = path.join(__dirname, 'fixtures/vinyl/');
    var expectedPath = path.join(__dirname, 'actual/test');
    var expectedCwd = __dirname;
    var expectedBase = path.join(__dirname, 'actual');
    var expectedMode = 0655;

    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: null,
      stat: {
        isDirectory: function(){
          return true;
        },
        mode: expectedMode
      }
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      buffered[0].cwd.should.equal(expectedCwd, 'cwd should have changed');
      buffered[0].base.should.equal(expectedBase, 'base should have changed');
      buffered[0].path.should.equal(expectedPath, 'path should have changed');
      fs.existsSync(expectedPath).should.equal(true);
      fs.lstatSync(expectedPath).isDirectory().should.equal(true);
      realMode(fs.lstatSync(expectedPath).mode).should.equal(expectedMode);
      done();
    };

    var stream = app.dest('./actual/', {cwd: __dirname});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

  it('should allow piping multiple dests in streaming mode', function(done) {
    var inputPath1 = path.join(__dirname, 'actual/multiple-first');
    var inputPath2 = path.join(__dirname, 'actual/multiple-second');
    var inputBase = path.join(__dirname, 'actual/');
    var srcPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');
    var stream1 = app.dest('./actual/', {cwd: __dirname});
    var stream2 = app.dest('./actual/', {cwd: __dirname});
    var content = fs.readFileSync(srcPath);
    var rename = through.obj(function(file, _, next) {
      file.path = inputPath2;
      this.push(file);
      next();
    });

    stream1.on('data', function(file) {
      file.path.should.equal(inputPath1);
    });

    stream1.pipe(rename).pipe(stream2);
    stream2.on('data', function(file) {
      file.path.should.equal(inputPath2);
    }).once('end', function() {
      fs.readFileSync(inputPath1, 'utf8').should.equal(content.toString());
      fs.readFileSync(inputPath2, 'utf8').should.equal(content.toString());
      done();
    });

    var file = new File({
      base: inputBase,
      path: inputPath1,
      cwd: __dirname,
      contents: content
    });

    stream1.write(file);
    stream1.end();
  });

  it('should write new files with the default user mode', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');
    var inputBase = path.join(__dirname, 'fixtures/vinyl/');
    var expectedPath = path.join(__dirname, 'actual/test.coffee');
    var expectedContents = fs.readFileSync(inputPath);
    var expectedMode = 0666 & (~process.umask());

    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: expectedContents,
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      fs.existsSync(expectedPath).should.equal(true);
      realMode(fs.lstatSync(expectedPath).mode).should.equal(expectedMode);
      done();
    };

    chmodSpy.reset();
    var stream = app.dest('./actual/', {cwd: __dirname});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);

    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

  it('should write new files with the specified mode', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');
    var inputBase = path.join(__dirname, 'fixtures/vinyl/');
    var expectedPath = path.join(__dirname, 'actual/test.coffee');
    var expectedContents = fs.readFileSync(inputPath);
    var expectedMode = 0744;

    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: expectedContents,
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      fs.existsSync(expectedPath).should.equal(true);
      realMode(fs.lstatSync(expectedPath).mode).should.equal(expectedMode);
      done();
    };

    chmodSpy.reset();
    var stream = app.dest('./actual/', {cwd: __dirname, mode:expectedMode});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);

    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

  it('should update file mode to match the vinyl mode', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');
    var inputBase = path.join(__dirname, 'fixtures/vinyl/');
    var expectedPath = path.join(__dirname, 'actual/test.coffee');
    var expectedContents = fs.readFileSync(inputPath);
    var expectedBase = path.join(__dirname, 'actual');
    var startMode = 0655;
    var expectedMode = 0722;

    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: expectedContents,
      stat: {
        mode: expectedMode
      }
    });

    var onEnd = function(){
      assert(chmodSpy.called);
      buffered.length.should.equal(1);
      buffered[0].should.equal(expectedFile);
      fs.existsSync(expectedPath).should.equal(true);
      realMode(fs.lstatSync(expectedPath).mode).should.equal(expectedMode);
      done();
    };

    fs.mkdirSync(expectedBase);
    fs.closeSync(fs.openSync(expectedPath, 'w'));
    fs.chmodSync(expectedPath, startMode);

    chmodSpy.reset();
    var stream = app.dest('./actual/', {cwd: __dirname});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);

    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

  it('should use different modes for files and directories', function(done) {
    var inputBase = path.join(__dirname, 'fixtures/vinyl');
    var inputPath = path.join(__dirname, 'fixtures/vinyl/wow/suchempty');
    var expectedBase = path.join(__dirname, 'actual/wow');
    var expectedDirMode = 0755;
    var expectedFileMode = 0655;

    var firstFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      stat: fs.statSync(inputPath)
    });

    var onEnd = function(){
      realMode(fs.lstatSync(expectedBase).mode).should.equal(expectedDirMode);
      realMode(buffered[0].stat.mode).should.equal(expectedFileMode);
      done();
    };

    var stream = app.dest('./actual/', {
      cwd: __dirname,
      mode: expectedFileMode,
      dirMode: expectedDirMode
    });

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);

    stream.pipe(bufferStream);
    stream.write(firstFile);
    stream.end();
  });

  it('should change to the specified base as string', function(done) {
    var inputBase = path.join(__dirname, 'fixtures/vinyl');
    var inputPath = path.join(__dirname, 'fixtures/vinyl/wow/suchempty');

    var firstFile = new File({
      cwd: __dirname,
      path: inputPath,
      stat: fs.statSync(inputPath)
    });

    var onEnd = function(){
      buffered[0].base.should.equal(inputBase);
      done();
    };

    var stream = app.dest('./actual/', {
      cwd: __dirname,
      base: inputBase
    });

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);

    stream.pipe(bufferStream);
    stream.write(firstFile);
    stream.end();
  });

  it('should change to the specified base as function', function(done) {
    var inputBase = path.join(__dirname, 'fixtures/vinyl');
    var inputPath = path.join(__dirname, 'fixtures/vinyl/wow/suchempty');

    var firstFile = new File({
      cwd: __dirname,
      path: inputPath,
      stat: fs.statSync(inputPath)
    });

    var onEnd = function() {
      buffered[0].base.should.equal(inputBase);
      done();
    };

    var stream = app.dest('./actual/', {
      cwd: __dirname,
      base: function(file){
        should.exist(file);
        file.path.should.equal(inputPath);
        return inputBase;
      }
    });

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);

    stream.pipe(bufferStream);
    stream.write(firstFile);
    stream.end();
  });

  it('should report IO errors', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');
    var inputBase = path.join(__dirname, 'fixtures/vinyl/');
    var expectedPath = path.join(__dirname, 'actual/test.coffee');
    var expectedContents = fs.readFileSync(inputPath);
    var expectedBase = path.join(__dirname, 'actual');
    var expectedMode = 0722;

    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: expectedContents,
      stat: {
        mode: expectedMode
      }
    });

    fs.mkdirSync(expectedBase);
    fs.closeSync(fs.openSync(expectedPath, 'w'));
    fs.chmodSync(expectedPath, 0);

    var stream = app.dest('./actual/', {cwd: __dirname});
    stream.on('error', function(err) {
      err.code.should.equal('EACCES');
      done();
    });
    stream.write(expectedFile);
  });

  it('should report stat errors', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');
    var inputBase = path.join(__dirname, 'fixtures/vinyl/');
    var expectedPath = path.join(__dirname, 'actual/test.coffee');
    var expectedContents = fs.readFileSync(inputPath);
    var expectedBase = path.join(__dirname, 'actual');
    var expectedMode = 0722;

    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: expectedContents,
      stat: {
        mode: expectedMode
      }
    });

    fs.mkdirSync(expectedBase);
    fs.closeSync(fs.openSync(expectedPath, 'w'));

    spies.setError(function(mod, fn) {
      if (fn === 'stat' && arguments[2] === expectedPath) {
        return new Error('stat error');
      }
    });

    var stream = app.dest('./actual/', {cwd: __dirname});
    stream.on('error', function(err) {
      err.message.should.equal('stat error');
      done();
    });
    stream.write(expectedFile);
  });

  it('should report chmod errors', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');
    var inputBase = path.join(__dirname, 'fixtures/vinyl/');
    var expectedPath = path.join(__dirname, 'actual/test.coffee');
    var expectedContents = fs.readFileSync(inputPath);
    var expectedBase = path.join(__dirname, 'actual');
    var expectedMode = 0722;

    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: expectedContents,
      stat: {
        mode: expectedMode
      }
    });

    fs.mkdirSync(expectedBase);
    fs.closeSync(fs.openSync(expectedPath, 'w'));

    spies.setError(function(mod, fn) {
      if (fn === 'chmod' && arguments[2] === expectedPath) {
        return new Error('chmod error');
      }
    });

    var stream = app.dest('./actual/', {cwd: __dirname});
    stream.on('error', function(err) {
      err.message.should.equal('chmod error');
      done();
    });
    stream.write(expectedFile);
  });

  it('should not chmod a matching file', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');
    var inputBase = path.join(__dirname, 'fixtures/vinyl/');
    var expectedPath = path.join(__dirname, 'actual/test.coffee');
    var expectedContents = fs.readFileSync(inputPath);
    var expectedBase = path.join(__dirname, 'actual');
    var expectedMode = 0722;

    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: expectedContents,
      stat: {
        mode: expectedMode
      }
    });

    var expectedCount = 0;
    spies.setError(function(mod, fn) {
      if (fn === 'stat' && arguments[2] === expectedPath) {
        expectedCount++;
      }
    });

    var onEnd = function(){
      expectedCount.should.equal(1);
      assert(!chmodSpy.called);
      realMode(fs.lstatSync(expectedPath).mode).should.equal(expectedMode);
      done();
    };

    fs.mkdirSync(expectedBase);
    fs.closeSync(fs.openSync(expectedPath, 'w'));
    fs.chmodSync(expectedPath, expectedMode);

    statSpy.reset();
    chmodSpy.reset();
    var stream = app.dest('./actual/', {cwd: __dirname});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);

    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

  it('should see a file with special chmod (setuid/setgid/sticky) as matching', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');
    var inputBase = path.join(__dirname, 'fixtures/vinyl/');
    var expectedPath = path.join(__dirname, 'actual/test.coffee');
    var expectedContents = fs.readFileSync(inputPath);
    var expectedBase = path.join(__dirname, 'actual');
    var expectedMode = 03722;
    var normalMode = 0722;

    var expectedFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: expectedContents,
      stat: {
        mode: normalMode
      }
    });

    var expectedCount = 0;
    spies.setError(function(mod, fn) {
      if (fn === 'stat' && arguments[2] === expectedPath) {
        expectedCount++;
      }
    });

    var onEnd = function(){
      expectedCount.should.equal(1);
      assert(!chmodSpy.called);
      done();
    };

    fs.mkdirSync(expectedBase);
    fs.closeSync(fs.openSync(expectedPath, 'w'));
    fs.chmodSync(expectedPath, expectedMode);

    statSpy.reset();
    chmodSpy.reset();
    var stream = app.dest('./actual/', {cwd: __dirname});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);

    stream.pipe(bufferStream);
    stream.write(expectedFile);
    stream.end();
  });

  it('should not overwrite files with overwrite option set to false', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');
    var inputBase = path.join(__dirname, 'fixtures/vinyl/');
    var inputContents = fs.readFileSync(inputPath);

    var expectedPath = path.join(__dirname, 'actual/test.coffee');
    var expectedBase = path.join(__dirname, 'actual');
    var existingContents = 'Lorem Ipsum';

    var inputFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: inputContents
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      bufEqual(fs.readFileSync(expectedPath), new Buffer(existingContents)).should.equal(true);
      done();
    };

    // Write expected file which should not be overwritten
    fs.mkdirSync(expectedBase);
    fs.writeFileSync(expectedPath, existingContents);

    var stream = app.dest('./actual/', {cwd: __dirname, overwrite: false});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(inputFile);
    stream.end();
  });

  it('should overwrite files with overwrite option set to true', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');
    var inputBase = path.join(__dirname, 'fixtures/vinyl/');
    var inputContents = fs.readFileSync(inputPath);

    var expectedPath = path.join(__dirname, 'actual/test.coffee');
    var expectedBase = path.join(__dirname, 'actual');
    var existingContents = 'Lorem Ipsum';

    var inputFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: inputContents
    });

    var onEnd = function(){
      buffered.length.should.equal(1);
      bufEqual(fs.readFileSync(expectedPath), new Buffer(inputContents)).should.equal(true);
      done();
    };

    // This should be overwritten
    fs.mkdirSync(expectedBase);
    fs.writeFileSync(expectedPath, existingContents);

    var stream = app.dest('./actual/', {cwd: __dirname, overwrite: true});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(inputFile);
    stream.end();
  });

  it('should create symlinks when the `symlink` attribute is set on the file', function(done) {
    var inputPath = path.join(__dirname, 'fixtures/vinyl/test-create-dir-symlink');
    var inputBase = path.join(__dirname, 'fixtures/vinyl/');
    var inputRelativeSymlinkPath = 'wow';

    var expectedPath = path.join(__dirname, 'actual/test-create-dir-symlink');

    var inputFile = new File({
      base: inputBase,
      cwd: __dirname,
      path: inputPath,
      contents: null, //''
    });

    // `src()` adds this side-effect with `keepSymlinks` option set to false
    inputFile.symlink = inputRelativeSymlinkPath;

    var onEnd = function(){
      fs.readlink(buffered[0].path, function() {
        buffered[0].symlink.should.equal(inputFile.symlink);
        buffered[0].path.should.equal(expectedPath);
        done();
      });
    };

    var stream = app.dest('./actual/', {cwd: __dirname});

    var buffered = [];
    bufferStream = through.obj(dataWrap(buffered.push.bind(buffered)), onEnd);
    stream.pipe(bufferStream);
    stream.write(inputFile);
    stream.end();
  });

  it('should emit finish event', function(done) {
    var srcPath = path.join(__dirname, 'fixtures/vinyl/test.coffee');
    var stream = app.dest('./actual/', {cwd: __dirname});

    stream.once('finish', function() {
      done();
    });

    var file = new File({
      path: srcPath,
      cwd: __dirname,
      contents: new Buffer("1234567890")
    });

    stream.write(file);
    stream.end();
  });
});

describe('dest', function() {
  beforeEach(function(done) {
    rimraf(actual, done);
    app = new App();
  });

  afterEach(function(done) {
    rimraf(actual, done);
  });

  describe('streams', function() {
    it('should return a stream', function(done) {
      var stream = app.dest(path.join(__dirname, 'fixtures/'));
      should.exist(stream);
      should.exist(stream.on);
      done();
    });

    it('should return an output stream that writes files', function(done) {
      var instream = app.src(path.join(__dirname, 'fixtures/copy/e*.txt'));
      var outstream = app.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function(file) {
        // data should be re-emitted correctly
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        path.join(file.path, '').should.equal(path.join(actual, 'example.txt'));
        String(file.contents).should.equal('Hello world!');
      });
      outstream.on('end', function() {
        fs.readFile(path.join(actual, 'example.txt'), function(err, contents) {
          should.not.exist(err);
          should.exist(contents);
          String(contents).should.equal('Hello world!');
          done();
        });
      });
    });

    it('should return an output stream that does not write non-read files', function(done) {
      var instream = app.src(path.join(__dirname, 'fixtures/copy/e*.txt'), {read: false});
      var outstream = app.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function(file) {
        // data should be re-emitted correctly
        should.exist(file);
        should.exist(file.path);
        should.not.exist(file.contents);
        path.join(file.path, '').should.equal(path.join(actual, 'example.txt'));
      });

      outstream.on('end', function() {
        fs.readFile(path.join(actual, 'example.txt'), function(err, contents) {
          should.exist(err);
          should.not.exist(contents);
          done();
        });
      });
    });

    it('should return an output stream that writes streaming files', function(done) {
      var instream = app.src(path.join(__dirname, 'fixtures/copy/e*.txt'), {buffer: false});
      var outstream = instream.pipe(app.dest(actual));

      outstream.on('error', done);
      outstream.on('data', function(file) {
        // data should be re-emitted correctly
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        path.join(file.path, '').should.equal(path.join(actual, 'example.txt'));
      });
      outstream.on('end', function() {
        fs.readFile(path.join(actual, 'example.txt'), function(err, contents) {
          should.not.exist(err);
          should.exist(contents);
          String(contents).should.equal('Hello world!');
          done();
        });
      });
    });

    it('should return an output stream that writes streaming files to new directories', function(done) {
      testWriteDir({}, done);
    });

    it('should return an output stream that writes streaming files to new directories (buffer: false)', function(done) {
      testWriteDir({buffer: false}, done);
    });

    it('should return an output stream that writes streaming files to new directories (read: false)', function(done) {
      testWriteDir({read: false}, done);
    });

    it('should return an output stream that writes streaming files to new directories (read: false, buffer: false)', function(done) {
      testWriteDir({buffer: false, read: false}, done);
    });

  });

  describe('ext', function() {
    beforeEach(function() {
      app = new App();
      app.set('ext', '.txt');
    });

    afterEach(function() {
      app.set('ext', '.html');
    });

    it('should return a stream', function(done) {
      var stream = app.dest(path.join(__dirname, 'fixtures/'));
      should.exist(stream);
      should.exist(stream.on);
      done();
    });

    it('should return an output stream that writes files', function(done) {
      var instream = app.src(path.join(__dirname, 'fixtures/copy/e*.txt'));
      var outstream = app.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function(file) {
        // data should be re-emitted correctly
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        path.join(file.path, '').should.equal(path.join(actual, 'example.txt'));
        String(file.contents).should.equal('Hello world!');
      });
      outstream.on('end', function() {
        fs.readFile(path.join(actual, 'example.txt'), function(err, contents) {
          should.not.exist(err);
          should.exist(contents);
          String(contents).should.equal('Hello world!');
          done();
        });
      });
    });

    it('should return an output stream that does not write non-read files', function(done) {
      var instream = app.src(path.join(__dirname, 'fixtures/dest/*.txt'), {read: false});
      var outstream = app.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function(file) {
        // data should be re-emitted correctly
        should.exist(file);
        should.exist(file.path);
        should.not.exist(file.contents);
        path.join(file.path, '').should.equal(path.join(actual, 'example.txt'));
      });

      outstream.on('end', function() {
        fs.readFile(path.join(actual, 'example.txt'), function(err, contents) {
          should.exist(err);
          should.not.exist(contents);
          done();
        });
      });
    });
  });

  function testWriteDir(srcOptions, done) {
    var instream = app.src(path.join(__dirname, 'fixtures/generic'), srcOptions);
    var outstream = instream.pipe(app.dest(actual));

    outstream.on('error', done);
    outstream.on('data', function(file) {
      // data should be re-emitted correctly
      should.exist(file);
      should.exist(file.path);
      path.join(file.path,'').should.equal(path.join(actual, 'generic'));
    });

    outstream.on('end', function() {
      fs.exists(path.join(actual, 'generic'), function(exists) {
        /* jshint expr: true */
        should(exists).be.ok;
        /* jshint expr: false */
        done();
      });
    });
  }
});

