import $ from 'jquery';
import ParsleyAbstract from './abstract';
import ParsleyUtils from './utils';

var ParsleyForm = function (element, domOptions, options) {
  this.__class__ = 'ParsleyForm';

  this.$element = $(element);
  this.domOptions = domOptions;
  this.options = options;
  this.parent = window.Parsley;

  this.fields = [];
  this.validationResult = null;
};

var statusMapping = {pending: null, resolved: true, rejected: false};

ParsleyForm.prototype = {
  onSubmitValidate: function (event) {
    // This is a Parsley generated submit event, do not validate, do not prevent, simply exit and keep normal behavior
    if (true === event.parsley)
      return;

    // If we didn't come here through a submit button, use the first one in the form
    var $submitSource = this._$submitSource || this.$element.find('input[type="submit"], button[type="submit"]').first();
    this._$submitSource = null;
    this.$element.find('.parsley-synthetic-submit-button').prop('disabled', true);
    if ($submitSource.is('[formnovalidate]'))
      return;

    var promise = this.whenValidate({event});

    if ('resolved' === promise.state() && false !== this._trigger('submit')) {
      // All good, let event go through. We make this distinction because browsers
      // differ in their handling of `submit` being called from inside a submit event [#1047]
    } else {
      // Rejected or pending: cancel this submit
      event.stopImmediatePropagation();
      event.preventDefault();
      if ('pending' === promise.state())
        promise.done(() => { this._submit($submitSource); });
    }
  },

  onSubmitButton: function(event) {
    this._$submitSource = $(event.target);
  },
  // internal
  // _submit submits the form, this time without going through the validations.
  // Care must be taken to "fake" the actual submit button being clicked.
  _submit: function ($submitSource) {
    if (false === this._trigger('submit'))
      return;
    // Add submit button's data
    if ($submitSource) {
      var $synthetic = this.$element.find('.parsley-synthetic-submit-button').prop('disabled', false);
      if (0 === $synthetic.length)
        $synthetic = $('<input class="parsley-synthetic-submit-button" type="hidden">').appendTo(this.$element);
      $synthetic.attr({
        name: $submitSource.attr('name'),
        value: $submitSource.attr('value')
      });
    }

    this.$element.trigger($.extend($.Event('submit'), {parsley: true}));
  },

  // Performs validation on fields while triggering events.
  // @returns `true` if all validations succeeds, `false`
  // if a failure is immediately detected, or `null`
  // if dependant on a promise.
  // Consider using `whenValidate` instead.
  validate: function (options) {
    if (arguments.length >= 1 && !$.isPlainObject(options)) {
      ParsleyUtils.warnOnce('Calling validate on a parsley form without passing arguments as an object is deprecated.');
      var [group, force, event] = arguments;
      options = {group, force, event};
    }
    return statusMapping[ this.whenValidate(options).state() ];
  },

  whenValidate: function ({group, force, event} = {}) {
    this.submitEvent = event;
    if (event) {
      this.submitEvent = $.extend({}, event, {preventDefault: () => {
        ParsleyUtils.warnOnce("Using `this.submitEvent.preventDefault()` is deprecated; instead, call `this.validationResult = false`");
        this.validationResult = false;
      }});
    }
    this.validationResult = true;

    // fire validate event to eventually modify things before very validation
    this._trigger('validate');

    // Refresh form DOM options and form's fields that could have changed
    this._refreshFields();

    var promises = this._withoutReactualizingFormOptions(() => {
      return $.map(this.fields, field => {
        return field.whenValidate({force, group});
      });
    });

    return $.when(...promises)
      .done(  () => { this._trigger('success'); })
      .fail(  () => {
        this.validationResult = false;
        this.focus();
        this._trigger('error');
      })
      .always(() => { this._trigger('validated'); })
      .pipe(...this._pipeAccordingToValidationResult());
  },

  // Iterate over refreshed fields, and stop on first failure.
  // Returns `true` if all fields are valid, `false` if a failure is detected
  // or `null` if the result depends on an unresolved promise.
  // Prefer using `whenValid` instead.
  isValid: function (options) {
    if (arguments.length >= 1 && !$.isPlainObject(options)) {
      ParsleyUtils.warnOnce('Calling isValid on a parsley form without passing arguments as an object is deprecated.');
      var [group, force] = arguments;
      options = {group, force};
    }
    return statusMapping[ this.whenValid(options).state() ];
  },

  // Iterate over refreshed fields and validate them.
  // Returns a promise.
  // A validation that immediately fails will interrupt the validations.
  whenValid: function ({group, force} = {}) {
    this._refreshFields();

    var promises = this._withoutReactualizingFormOptions(() => {
      return $.map(this.fields, field => {
        return field.whenValid({group, force});
      });
    });
    return $.when(...promises);
  },

  _refreshFields: function () {
    return this.actualizeOptions()._bindFields();
  },

  _bindFields: function () {
    var oldFields = this.fields;

    this.fields = [];
    this.fieldsMappedById = {};

    this._withoutReactualizingFormOptions(() => {
      this.$element
      .find(this.options.inputs)
      .not(this.options.excluded)
      .each((_, element) => {
        var fieldInstance = new window.Parsley.Factory(element, {}, this);

        // Only add valid and not excluded `ParsleyField` and `ParsleyFieldMultiple` children
        if (('ParsleyField' === fieldInstance.__class__ || 'ParsleyFieldMultiple' === fieldInstance.__class__) && (true !== fieldInstance.options.excluded))
          if ('undefined' === typeof this.fieldsMappedById[fieldInstance.__class__ + '-' + fieldInstance.__id__]) {
            this.fieldsMappedById[fieldInstance.__class__ + '-' + fieldInstance.__id__] = fieldInstance;
            this.fields.push(fieldInstance);
          }
      });

      $(oldFields).not(this.fields).each((_, field) => {
        field._trigger('reset');
      });
    });
    return this;
  },

  // Internal only.
  // Looping on a form's fields to do validation or similar
  // will trigger reactualizing options on all of them, which
  // in turn will reactualize the form's options.
  // To avoid calling actualizeOptions so many times on the form
  // for nothing, _withoutReactualizingFormOptions temporarily disables
  // the method actualizeOptions on this form while `fn` is called.
  _withoutReactualizingFormOptions: function (fn) {
    var oldActualizeOptions = this.actualizeOptions;
    this.actualizeOptions = function () { return this; };
    var result = fn();
    this.actualizeOptions = oldActualizeOptions;
    return result;
  },

  // Internal only.
  // Shortcut to trigger an event
  // Returns true iff event is not interrupted and default not prevented.
  _trigger: function (eventName) {
    return this.trigger('form:' + eventName);
  }

};

export default ParsleyForm;
