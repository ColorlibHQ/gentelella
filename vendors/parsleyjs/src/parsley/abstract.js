import $ from 'jquery';
import ParsleyUtils from './utils';

var ParsleyAbstract = function () {
  this.__id__ = ParsleyUtils.generateID();
};

ParsleyAbstract.prototype = {
  asyncSupport: true, // Deprecated

  _pipeAccordingToValidationResult: function () {
    var pipe = () => {
      var r = $.Deferred();
      if (true !== this.validationResult)
        r.reject();
      return r.resolve().promise();
    };
    return [pipe, pipe];
  },

  actualizeOptions: function () {
    ParsleyUtils.attr(this.$element, this.options.namespace, this.domOptions);
    if (this.parent && this.parent.actualizeOptions)
      this.parent.actualizeOptions();
    return this;
  },

  _resetOptions: function (initOptions) {
    this.domOptions = ParsleyUtils.objectCreate(this.parent.options);
    this.options = ParsleyUtils.objectCreate(this.domOptions);
    // Shallow copy of ownProperties of initOptions:
    for (var i in initOptions) {
      if (initOptions.hasOwnProperty(i))
        this.options[i] = initOptions[i];
    }
    this.actualizeOptions();
  },

  _listeners: null,

  // Register a callback for the given event name
  // Callback is called with context as the first argument and the `this`
  // The context is the current parsley instance, or window.Parsley if global
  // A return value of `false` will interrupt the calls
  on: function (name, fn) {
    this._listeners = this._listeners || {};
    var queue = this._listeners[name] = this._listeners[name] || [];
    queue.push(fn);

    return this;
  },

  // Deprecated. Use `on` instead
  subscribe: function(name, fn) {
    $.listenTo(this, name.toLowerCase(), fn);
  },

  // Unregister a callback (or all if none is given) for the given event name
  off: function (name, fn) {
    var queue = this._listeners && this._listeners[name];
    if (queue) {
      if (!fn) {
        delete this._listeners[name];
      } else {
        for (var i = queue.length; i--; )
          if (queue[i] === fn)
            queue.splice(i, 1);
      }
    }
    return this;
  },

  // Deprecated. Use `off`
  unsubscribe: function(name, fn) {
    $.unsubscribeTo(this, name.toLowerCase());
  },

  // Trigger an event of the given name
  // A return value of `false` interrupts the callback chain
  // Returns false if execution was interrupted
  trigger: function (name, target, extraArg) {
    target = target || this;
    var queue = this._listeners && this._listeners[name];
    var result;
    var parentResult;
    if (queue) {
      for (var i = queue.length; i--; ) {
        result = queue[i].call(target, target, extraArg);
        if (result === false) return result;
      }
    }
    if (this.parent) {
      return this.parent.trigger(name, target, extraArg);
    }
    return true;
  },

  // Reset UI
  reset: function () {
    // Field case: just emit a reset event for UI
    if ('ParsleyForm' !== this.__class__) {
      this._resetUI();
      return this._trigger('reset');
    }

    // Form case: emit a reset event for each field
    for (var i = 0; i < this.fields.length; i++)
      this.fields[i].reset();

    this._trigger('reset');
  },

  // Destroy Parsley instance (+ UI)
  destroy: function () {
    // Field case: emit destroy event to clean UI and then destroy stored instance
    this._destroyUI();
    if ('ParsleyForm' !== this.__class__) {
      this.$element.removeData('Parsley');
      this.$element.removeData('ParsleyFieldMultiple');
      this._trigger('destroy');

      return;
    }

    // Form case: destroy all its fields and then destroy stored instance
    for (var i = 0; i < this.fields.length; i++)
      this.fields[i].destroy();

    this.$element.removeData('Parsley');
    this._trigger('destroy');
  },

  asyncIsValid: function (group, force) {
    ParsleyUtils.warnOnce("asyncIsValid is deprecated; please use whenValid instead");
    return this.whenValid({group, force});
  },

  _findRelated: function () {
    return this.options.multiple ?
      this.parent.$element.find(`[${this.options.namespace}multiple="${this.options.multiple}"]`)
    : this.$element;
  }
};

export default ParsleyAbstract;
