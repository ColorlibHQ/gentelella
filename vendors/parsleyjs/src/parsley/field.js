import $ from 'jquery';
import ConstraintFactory from './factory/constraint';
import ParsleyUI from './ui';
import ParsleyUtils from './utils';

var ParsleyField = function (field, domOptions, options, parsleyFormInstance) {
  this.__class__ = 'ParsleyField';

  this.$element = $(field);

  // Set parent if we have one
  if ('undefined' !== typeof parsleyFormInstance) {
    this.parent = parsleyFormInstance;
  }

  this.options = options;
  this.domOptions = domOptions;

  // Initialize some properties
  this.constraints = [];
  this.constraintsByName = {};
  this.validationResult = true;

  // Bind constraints
  this._bindConstraints();
};

var statusMapping = {pending: null, resolved: true, rejected: false};

ParsleyField.prototype = {
  // # Public API
  // Validate field and trigger some events for mainly `ParsleyUI`
  // @returns `true`, an array of the validators that failed, or
  // `null` if validation is not finished. Prefer using whenValidate
  validate: function (options) {
    if (arguments.length >= 1 && !$.isPlainObject(options)) {
      ParsleyUtils.warnOnce('Calling validate on a parsley field without passing arguments as an object is deprecated.');
      options = {options};
    }
    var promise = this.whenValidate(options);
    if (!promise)  // If excluded with `group` option
      return true;
    switch (promise.state()) {
      case 'pending': return null;
      case 'resolved': return true;
      case 'rejected': return this.validationResult;
    }
  },

  // Validate field and trigger some events for mainly `ParsleyUI`
  // @returns a promise that succeeds only when all validations do
  // or `undefined` if field is not in the given `group`.
  whenValidate: function ({force, group} =  {}) {
    // do not validate a field if not the same as given validation group
    this.refreshConstraints();
    if (group && !this._isInGroup(group))
      return;

    this.value = this.getValue();

    // Field Validate event. `this.value` could be altered for custom needs
    this._trigger('validate');

    return this.whenValid({force, value: this.value, _refreshed: true})
      .always(() => { this._reflowUI(); })
      .done(() =>   { this._trigger('success'); })
      .fail(() =>   { this._trigger('error'); })
      .always(() => { this._trigger('validated'); })
      .pipe(...this._pipeAccordingToValidationResult());
  },

  hasConstraints: function () {
    return 0 !== this.constraints.length;
  },

  // An empty optional field does not need validation
  needsValidation: function (value) {
    if ('undefined' === typeof value)
      value = this.getValue();

    // If a field is empty and not required, it is valid
    // Except if `data-parsley-validate-if-empty` explicitely added, useful for some custom validators
    if (!value.length && !this._isRequired() && 'undefined' === typeof this.options.validateIfEmpty)
      return false;

    return true;
  },

  _isInGroup: function (group) {
    if ($.isArray(this.options.group))
      return -1 !== $.inArray(group, this.options.group);
    return this.options.group === group;
  },

  // Just validate field. Do not trigger any event.
  // Returns `true` iff all constraints pass, `false` if there are failures,
  // or `null` if the result can not be determined yet (depends on a promise)
  // See also `whenValid`.
  isValid: function (options) {
    if (arguments.length >= 1 && !$.isPlainObject(options)) {
      ParsleyUtils.warnOnce('Calling isValid on a parsley field without passing arguments as an object is deprecated.');
      var [force, value] = arguments;
      options = {force, value};
    }
    var promise = this.whenValid(options);
    if (!promise) // Excluded via `group`
      return true;
    return statusMapping[promise.state()];
  },

  // Just validate field. Do not trigger any event.
  // @returns a promise that succeeds only when all validations do
  // or `undefined` if the field is not in the given `group`.
  // The argument `force` will force validation of empty fields.
  // If a `value` is given, it will be validated instead of the value of the input.
  whenValid: function ({force = false, value, group, _refreshed} = {}) {
    // Recompute options and rebind constraints to have latest changes
    if (!_refreshed)
      this.refreshConstraints();
    // do not validate a field if not the same as given validation group
    if (group && !this._isInGroup(group))
      return;

    this.validationResult = true;

    // A field without constraint is valid
    if (!this.hasConstraints())
      return $.when();

    // Value could be passed as argument, needed to add more power to 'field:validate'
    if ('undefined' === typeof value || null === value)
      value = this.getValue();

    if (!this.needsValidation(value) && true !== force)
      return $.when();

    var groupedConstraints = this._getGroupedConstraints();
    var promises = [];
    $.each(groupedConstraints, (_, constraints) => {
      // Process one group of constraints at a time, we validate the constraints
      // and combine the promises together.
      var promise = $.when(
        ...$.map(constraints, constraint => this._validateConstraint(value, constraint))
      );
      promises.push(promise);
      if (promise.state() === 'rejected')
        return false; // Interrupt processing if a group has already failed
    });
    return $.when.apply($, promises);
  },

  // @returns a promise
  _validateConstraint: function(value, constraint) {
    var result = constraint.validate(value, this);
    // Map false to a failed promise
    if (false === result)
      result = $.Deferred().reject();
    // Make sure we return a promise and that we record failures
    return $.when(result).fail(errorMessage => {
      if (!(this.validationResult instanceof Array))
        this.validationResult = [];
      this.validationResult.push({
        assert: constraint,
        errorMessage: 'string' === typeof errorMessage && errorMessage
      });
    });
  },

  // @returns Parsley field computed value that could be overrided or configured in DOM
  getValue: function () {
    var value;

    // Value could be overriden in DOM or with explicit options
    if ('function' === typeof this.options.value)
      value = this.options.value(this);
    else if ('undefined' !== typeof this.options.value)
      value = this.options.value;
    else
      value = this.$element.val();

    // Handle wrong DOM or configurations
    if ('undefined' === typeof value || null === value)
      return '';

    return this._handleWhitespace(value);
  },

  // Actualize options that could have change since previous validation
  // Re-bind accordingly constraints (could be some new, removed or updated)
  refreshConstraints: function () {
    return this.actualizeOptions()._bindConstraints();
  },

  /**
  * Add a new constraint to a field
  *
  * @param {String}   name
  * @param {Mixed}    requirements      optional
  * @param {Number}   priority          optional
  * @param {Boolean}  isDomConstraint   optional
  */
  addConstraint: function (name, requirements, priority, isDomConstraint) {

    if (window.Parsley._validatorRegistry.validators[name]) {
      var constraint = new ConstraintFactory(this, name, requirements, priority, isDomConstraint);

      // if constraint already exist, delete it and push new version
      if ('undefined' !== this.constraintsByName[constraint.name])
        this.removeConstraint(constraint.name);

      this.constraints.push(constraint);
      this.constraintsByName[constraint.name] = constraint;
    }

    return this;
  },

  // Remove a constraint
  removeConstraint: function (name) {
    for (var i = 0; i < this.constraints.length; i++)
      if (name === this.constraints[i].name) {
        this.constraints.splice(i, 1);
        break;
      }
    delete this.constraintsByName[name];
    return this;
  },

  // Update a constraint (Remove + re-add)
  updateConstraint: function (name, parameters, priority) {
    return this.removeConstraint(name)
      .addConstraint(name, parameters, priority);
  },

  // # Internals

  // Internal only.
  // Bind constraints from config + options + DOM
  _bindConstraints: function () {
    var constraints = [];
    var constraintsByName = {};

    // clean all existing DOM constraints to only keep javascript user constraints
    for (var i = 0; i < this.constraints.length; i++)
      if (false === this.constraints[i].isDomConstraint) {
        constraints.push(this.constraints[i]);
        constraintsByName[this.constraints[i].name] = this.constraints[i];
      }

    this.constraints = constraints;
    this.constraintsByName = constraintsByName;

    // then re-add Parsley DOM-API constraints
    for (var name in this.options)
      this.addConstraint(name, this.options[name], undefined, true);

    // finally, bind special HTML5 constraints
    return this._bindHtml5Constraints();
  },

  // Internal only.
  // Bind specific HTML5 constraints to be HTML5 compliant
  _bindHtml5Constraints: function () {
    // html5 required
    if (this.$element.hasClass('required') || this.$element.attr('required'))
      this.addConstraint('required', true, undefined, true);

    // html5 pattern
    if ('string' === typeof this.$element.attr('pattern'))
      this.addConstraint('pattern', this.$element.attr('pattern'), undefined, true);

    // range
    if ('undefined' !== typeof this.$element.attr('min') && 'undefined' !== typeof this.$element.attr('max'))
      this.addConstraint('range', [this.$element.attr('min'), this.$element.attr('max')], undefined, true);

    // HTML5 min
    else if ('undefined' !== typeof this.$element.attr('min'))
      this.addConstraint('min', this.$element.attr('min'), undefined, true);

    // HTML5 max
    else if ('undefined' !== typeof this.$element.attr('max'))
      this.addConstraint('max', this.$element.attr('max'), undefined, true);


    // length
    if ('undefined' !== typeof this.$element.attr('minlength') && 'undefined' !== typeof this.$element.attr('maxlength'))
      this.addConstraint('length', [this.$element.attr('minlength'), this.$element.attr('maxlength')], undefined, true);

    // HTML5 minlength
    else if ('undefined' !== typeof this.$element.attr('minlength'))
      this.addConstraint('minlength', this.$element.attr('minlength'), undefined, true);

    // HTML5 maxlength
    else if ('undefined' !== typeof this.$element.attr('maxlength'))
      this.addConstraint('maxlength', this.$element.attr('maxlength'), undefined, true);


    // html5 types
    var type = this.$element.attr('type');

    if ('undefined' === typeof type)
      return this;

    // Small special case here for HTML5 number: integer validator if step attribute is undefined or an integer value, number otherwise
    if ('number' === type) {
      return this.addConstraint('type', ['number', {
        step: this.$element.attr('step'),
        base: this.$element.attr('min') || this.$element.attr('value')
      }], undefined, true);
    // Regular other HTML5 supported types
    } else if (/^(email|url|range)$/i.test(type)) {
      return this.addConstraint('type', type, undefined, true);
    }
    return this;
  },

  // Internal only.
  // Field is required if have required constraint without `false` value
  _isRequired: function () {
    if ('undefined' === typeof this.constraintsByName.required)
      return false;

    return false !== this.constraintsByName.required.requirements;
  },

  // Internal only.
  // Shortcut to trigger an event
  _trigger: function (eventName) {
    return this.trigger('field:' + eventName);
  },

  // Internal only
  // Handles whitespace in a value
  // Use `data-parsley-whitespace="squish"` to auto squish input value
  // Use `data-parsley-whitespace="trim"` to auto trim input value
  _handleWhitespace: function (value) {
    if (true === this.options.trimValue)
      ParsleyUtils.warnOnce('data-parsley-trim-value="true" is deprecated, please use data-parsley-whitespace="trim"');

    if ('squish' === this.options.whitespace)
      value = value.replace(/\s{2,}/g, ' ');

    if (('trim' === this.options.whitespace) || ('squish' === this.options.whitespace) || (true === this.options.trimValue))
      value = ParsleyUtils.trimString(value);

    return value;
  },

  // Internal only.
  // Returns the constraints, grouped by descending priority.
  // The result is thus an array of arrays of constraints.
  _getGroupedConstraints: function () {
    if (false === this.options.priorityEnabled)
      return [this.constraints];

    var groupedConstraints = [];
    var index = {};

    // Create array unique of priorities
    for (var i = 0; i < this.constraints.length; i++) {
      var p = this.constraints[i].priority;
      if (!index[p])
        groupedConstraints.push(index[p] = []);
      index[p].push(this.constraints[i]);
    }
    // Sort them by priority DESC
    groupedConstraints.sort(function (a, b) { return b[0].priority - a[0].priority; });

    return groupedConstraints;
  }

};

export default ParsleyField;
