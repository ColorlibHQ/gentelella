import $ from 'jquery';
import ParsleyUtils from './utils';
import ParsleyDefaults from './defaults';
import ParsleyAbstract from './abstract';
import ParsleyValidatorRegistry from './validator_registry';
import ParsleyUI from './ui';
import ParsleyForm from './form';
import ParsleyField from './field';
import ParsleyMultiple from './multiple';
import ParsleyFactory from './factory';

var vernums = $.fn.jquery.split('.');
if (parseInt(vernums[0]) <= 1 && parseInt(vernums[1]) < 8) {
  throw "The loaded version of jQuery is too old. Please upgrade to 1.8.x or better.";
}
if (!vernums.forEach) {
  ParsleyUtils.warn('Parsley requires ES5 to run properly. Please include https://github.com/es-shims/es5-shim');
}
// Inherit `on`, `off` & `trigger` to Parsley:
var Parsley = $.extend(new ParsleyAbstract(), {
    $element: $(document),
    actualizeOptions: null,
    _resetOptions: null,
    Factory: ParsleyFactory,
    version: '@@version'
  });

// Supplement ParsleyField and Form with ParsleyAbstract
// This way, the constructors will have access to those methods
$.extend(ParsleyField.prototype, ParsleyUI.Field, ParsleyAbstract.prototype);
$.extend(ParsleyForm.prototype, ParsleyUI.Form, ParsleyAbstract.prototype);
// Inherit actualizeOptions and _resetOptions:
$.extend(ParsleyFactory.prototype, ParsleyAbstract.prototype);

// ### jQuery API
// `$('.elem').parsley(options)` or `$('.elem').psly(options)`
$.fn.parsley = $.fn.psly = function (options) {
  if (this.length > 1) {
    var instances = [];

    this.each(function () {
      instances.push($(this).parsley(options));
    });

    return instances;
  }

  // Return undefined if applied to non existing DOM element
  if (!$(this).length) {
    ParsleyUtils.warn('You must bind Parsley on an existing element.');

    return;
  }

  return new ParsleyFactory(this, options);
};

// ### ParsleyField and ParsleyForm extension
// Ensure the extension is now defined if it wasn't previously
if ('undefined' === typeof window.ParsleyExtend)
  window.ParsleyExtend = {};

// ### Parsley config
// Inherit from ParsleyDefault, and copy over any existing values
Parsley.options = $.extend(ParsleyUtils.objectCreate(ParsleyDefaults), window.ParsleyConfig);
window.ParsleyConfig = Parsley.options; // Old way of accessing global options

// ### Globals
window.Parsley = window.psly = Parsley;
window.ParsleyUtils = ParsleyUtils;

// ### Define methods that forward to the registry, and deprecate all access except through window.Parsley
var registry = window.Parsley._validatorRegistry = new ParsleyValidatorRegistry(window.ParsleyConfig.validators, window.ParsleyConfig.i18n);
window.ParsleyValidator = {};
$.each('setLocale addCatalog addMessage addMessages getErrorMessage formatMessage addValidator updateValidator removeValidator'.split(' '), function (i, method) {
  window.Parsley[method] = $.proxy(registry, method);
  window.ParsleyValidator[method] = function () {
    ParsleyUtils.warnOnce(`Accessing the method '${method}' through ParsleyValidator is deprecated. Simply call 'window.Parsley.${method}(...)'`);
    return window.Parsley[method](...arguments);
  };
});

// ### ParsleyUI
// Deprecated global object
window.Parsley.UI = ParsleyUI;
window.ParsleyUI = {
  removeError: function (instance, name, doNotUpdateClass) {
    var updateClass = true !== doNotUpdateClass;
    ParsleyUtils.warnOnce(`Accessing ParsleyUI is deprecated. Call 'removeError' on the instance directly. Please comment in issue 1073 as to your need to call this method.`);
    return instance.removeError(name, {updateClass});
  },
  getErrorsMessages: function (instance) {
    ParsleyUtils.warnOnce(`Accessing ParsleyUI is deprecated. Call 'getErrorsMessages' on the instance directly.`);
    return instance.getErrorsMessages();
  }
};
$.each('addError updateError'.split(' '), function (i, method) {
  window.ParsleyUI[method] = function (instance, name, message, assert, doNotUpdateClass) {
    var updateClass = true !== doNotUpdateClass;
    ParsleyUtils.warnOnce(`Accessing ParsleyUI is deprecated. Call '${method}' on the instance directly. Please comment in issue 1073 as to your need to call this method.`);
    return instance[method](name, {message, assert, updateClass});
  };
});

// ### PARSLEY auto-binding
// Prevent it by setting `ParsleyConfig.autoBind` to `false`
if (false !== window.ParsleyConfig.autoBind) {
  $(function () {
    // Works only on `data-parsley-validate`.
    if ($('[data-parsley-validate]').length)
      $('[data-parsley-validate]').parsley();
  });
}

export default Parsley;
