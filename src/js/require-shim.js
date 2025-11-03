// Minimal CommonJS/AMD compatibility shim for third-party libraries in the browser.
// Must be loaded *after* jQuery so that `window.jQuery` / `window.$` already exist.
// 1. Exposes a global `require()` that returns jQuery when asked for "jquery".
// 2. Ensures `module` / `exports` point to jQuery so libraries taking the CommonJS
//    branch receive the real jQuery function.
// 3. Provides stubbed AMD helpers so AMD checks don't error out.
(function (global) {
  // Helper – link module.exports to jQuery if possible
  function ensureModuleExports() {
    if (
      typeof global.jQuery !== 'undefined' &&
      (typeof global.module === 'undefined' || !global.module.exports)
    ) {
      global.module = { exports: global.jQuery };
      global.exports = global.jQuery;
    }
  }

  // Define require() if it doesn't already exist
  if (typeof global.require === 'undefined') {
    global.require = function (name) {
      if (name === 'jquery' || name === 'jquery') {
        return global.jQuery || global.$;
      }
      return {};
    };
    global.require.config = function () {};
    global.require.amd = {};
  }

  // Define module/exports if they're missing, pointing them at jQuery.
  ensureModuleExports();

  // If jQuery is loaded later (unlikely but safe), run again after the load event.
  if (typeof global.jQuery === 'undefined') {
    global.addEventListener('load', ensureModuleExports);
  }
})(typeof window !== 'undefined' ? window : this);
