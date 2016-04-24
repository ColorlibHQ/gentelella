var fs = require('fs');
var sinon = require('sinon');

var errorfn = false;

function maybeCallAsync(module, func) {
  var original = module[func];
  return sinon.stub(module, func, function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(module, func);
    var err = typeof errorfn === 'function' &&
              errorfn.apply(this, args);
    if (!err) {
      original.apply(this, arguments);
    } else {
      arguments[arguments.length - 1](err);
    }
  });
}

module.exports = {
  setError: function(fn) {
    errorfn = fn;
  },
  chmodSpy: maybeCallAsync(fs, 'chmod'),
  statSpy: maybeCallAsync(fs, 'stat')
};
