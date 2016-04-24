import $ from 'jquery';
import ParsleyUtils from './utils';

var ParsleyUI = {};

var diffResults = function (newResult, oldResult, deep) {
  var added = [];
  var kept = [];

  for (var i = 0; i < newResult.length; i++) {
    var found = false;

    for (var j = 0; j < oldResult.length; j++)
      if (newResult[i].assert.name === oldResult[j].assert.name) {
        found = true;
        break;
      }

    if (found)
      kept.push(newResult[i]);
    else
      added.push(newResult[i]);
  }

  return {
    kept: kept,
    added: added,
    removed: !deep ? diffResults(oldResult, newResult, true).added : []
  };
};

ParsleyUI.Form = {

  _actualizeTriggers: function () {
    this.$element.on('submit.Parsley', evt => { this.onSubmitValidate(evt); });
    this.$element.on('click.Parsley', 'input[type="submit"], button[type="submit"]', evt => { this.onSubmitButton(evt); });

    // UI could be disabled
    if (false === this.options.uiEnabled)
      return;

    this.$element.attr('novalidate', '');
  },

  focus: function () {
    this._focusedField = null;

    if (true === this.validationResult || 'none' === this.options.focus)
      return null;

    for (var i = 0; i < this.fields.length; i++) {
      var field = this.fields[i];
      if (true !== field.validationResult && field.validationResult.length > 0 && 'undefined' === typeof field.options.noFocus) {
        this._focusedField = field.$element;
        if ('first' === this.options.focus)
          break;
      }
    }

    if (null === this._focusedField)
      return null;

    return this._focusedField.focus();
  },

  _destroyUI: function () {
    // Reset all event listeners
    this.$element.off('.Parsley');
  }

};

ParsleyUI.Field = {

  _reflowUI: function () {
    this._buildUI();

    // If this field doesn't have an active UI don't bother doing something
    if (!this._ui)
      return;

    // Diff between two validation results
    var diff = diffResults(this.validationResult, this._ui.lastValidationResult);

    // Then store current validation result for next reflow
    this._ui.lastValidationResult = this.validationResult;

    // Handle valid / invalid / none field class
    this._manageStatusClass();

    // Add, remove, updated errors messages
    this._manageErrorsMessages(diff);

    // Triggers impl
    this._actualizeTriggers();

    // If field is not valid for the first time, bind keyup trigger to ease UX and quickly inform user
    if ((diff.kept.length || diff.added.length) && !this._failedOnce) {
      this._failedOnce = true;
      this._actualizeTriggers();
    }
  },

  // Returns an array of field's error message(s)
  getErrorsMessages: function () {
    // No error message, field is valid
    if (true === this.validationResult)
      return [];

    var messages = [];

    for (var i = 0; i < this.validationResult.length; i++)
      messages.push(this.validationResult[i].errorMessage ||
       this._getErrorMessage(this.validationResult[i].assert));

    return messages;
  },

  // It's a goal of Parsley that this method is no longer required [#1073]
  addError: function (name, {message, assert, updateClass = true} = {}) {
    this._buildUI();
    this._addError(name, {message, assert});

    if (updateClass)
      this._errorClass();
  },

  // It's a goal of Parsley that this method is no longer required [#1073]
  updateError: function (name, {message, assert, updateClass = true} = {}) {
    this._buildUI();
    this._updateError(name, {message, assert});

    if (updateClass)
      this._errorClass();
  },

  // It's a goal of Parsley that this method is no longer required [#1073]
  removeError: function (name, {updateClass = true} = {}) {
    this._buildUI();
    this._removeError(name);

    // edge case possible here: remove a standard Parsley error that is still failing in this.validationResult
    // but highly improbable cuz' manually removing a well Parsley handled error makes no sense.
    if (updateClass)
      this._manageStatusClass();
  },

  _manageStatusClass: function () {
    if (this.hasConstraints() && this.needsValidation() && true === this.validationResult)
      this._successClass();
    else if (this.validationResult.length > 0)
      this._errorClass();
    else
      this._resetClass();
  },

  _manageErrorsMessages: function (diff) {
    if ('undefined' !== typeof this.options.errorsMessagesDisabled)
      return;

    // Case where we have errorMessage option that configure an unique field error message, regardless failing validators
    if ('undefined' !== typeof this.options.errorMessage) {
      if ((diff.added.length || diff.kept.length)) {
        this._insertErrorWrapper();

        if (0 === this._ui.$errorsWrapper.find('.parsley-custom-error-message').length)
          this._ui.$errorsWrapper
            .append(
              $(this.options.errorTemplate)
              .addClass('parsley-custom-error-message')
            );

        return this._ui.$errorsWrapper
          .addClass('filled')
          .find('.parsley-custom-error-message')
          .html(this.options.errorMessage);
      }

      return this._ui.$errorsWrapper
        .removeClass('filled')
        .find('.parsley-custom-error-message')
        .remove();
    }

    // Show, hide, update failing constraints messages
    for (var i = 0; i < diff.removed.length; i++)
      this._removeError(diff.removed[i].assert.name);

    for (i = 0; i < diff.added.length; i++)
      this._addError(diff.added[i].assert.name, {message: diff.added[i].errorMessage, assert: diff.added[i].assert});

    for (i = 0; i < diff.kept.length; i++)
      this._updateError(diff.kept[i].assert.name, {message: diff.kept[i].errorMessage, assert: diff.kept[i].assert});
  },


  _addError: function (name, {message, assert}) {
    this._insertErrorWrapper();
    this._ui.$errorsWrapper
      .addClass('filled')
      .append(
        $(this.options.errorTemplate)
        .addClass('parsley-' + name)
        .html(message || this._getErrorMessage(assert))
      );
  },

  _updateError: function (name, {message, assert}) {
    this._ui.$errorsWrapper
      .addClass('filled')
      .find('.parsley-' + name)
      .html(message || this._getErrorMessage(assert));
  },

  _removeError: function (name) {
    this._ui.$errorsWrapper
      .removeClass('filled')
      .find('.parsley-' + name)
      .remove();
  },

  _getErrorMessage: function (constraint) {
    var customConstraintErrorMessage = constraint.name + 'Message';

    if ('undefined' !== typeof this.options[customConstraintErrorMessage])
      return window.Parsley.formatMessage(this.options[customConstraintErrorMessage], constraint.requirements);

    return window.Parsley.getErrorMessage(constraint);
  },

  _buildUI: function () {
    // UI could be already built or disabled
    if (this._ui || false === this.options.uiEnabled)
      return;

    var _ui = {};

    // Give field its Parsley id in DOM
    this.$element.attr(this.options.namespace + 'id', this.__id__);

    /** Generate important UI elements and store them in this **/
    // $errorClassHandler is the $element that woul have parsley-error and parsley-success classes
    _ui.$errorClassHandler = this._manageClassHandler();

    // $errorsWrapper is a div that would contain the various field errors, it will be appended into $errorsContainer
    _ui.errorsWrapperId = 'parsley-id-' + (this.options.multiple ? 'multiple-' + this.options.multiple : this.__id__);
    _ui.$errorsWrapper = $(this.options.errorsWrapper).attr('id', _ui.errorsWrapperId);

    // ValidationResult UI storage to detect what have changed bwt two validations, and update DOM accordingly
    _ui.lastValidationResult = [];
    _ui.validationInformationVisible = false;

    // Store it in this for later
    this._ui = _ui;
  },

  // Determine which element will have `parsley-error` and `parsley-success` classes
  _manageClassHandler: function () {
    // An element selector could be passed through DOM with `data-parsley-class-handler=#foo`
    if ('string' === typeof this.options.classHandler && $(this.options.classHandler).length)
      return $(this.options.classHandler);

    // Class handled could also be determined by function given in Parsley options
    var $handler = this.options.classHandler.call(this, this);

    // If this function returned a valid existing DOM element, go for it
    if ('undefined' !== typeof $handler && $handler.length)
      return $handler;

    // Otherwise, if simple element (input, texatrea, select...) it will perfectly host the classes
    if (!this.options.multiple || this.$element.is('select'))
      return this.$element;

    // But if multiple element (radio, checkbox), that would be their parent
    return this.$element.parent();
  },

  _insertErrorWrapper: function () {
    var $errorsContainer;

    // Nothing to do if already inserted
    if (0 !== this._ui.$errorsWrapper.parent().length)
      return this._ui.$errorsWrapper.parent();

    if ('string' === typeof this.options.errorsContainer) {
      if ($(this.options.errorsContainer).length)
        return $(this.options.errorsContainer).append(this._ui.$errorsWrapper);
      else
        ParsleyUtils.warn('The errors container `' + this.options.errorsContainer + '` does not exist in DOM');
    } else if ('function' === typeof this.options.errorsContainer)
      $errorsContainer = this.options.errorsContainer.call(this, this);

    if ('undefined' !== typeof $errorsContainer && $errorsContainer.length)
      return $errorsContainer.append(this._ui.$errorsWrapper);

    var $from = this.$element;
    if (this.options.multiple)
      $from = $from.parent();
    return $from.after(this._ui.$errorsWrapper);
  },

  _actualizeTriggers: function () {
    var $toBind = this._findRelated();

    // Remove Parsley events already bound on this field
    $toBind.off('.Parsley');
    if (this._failedOnce)
      $toBind.on(ParsleyUtils.namespaceEvents(this.options.triggerAfterFailure, 'Parsley'), () => {
        this.validate();
      });
    else {
      $toBind.on(ParsleyUtils.namespaceEvents(this.options.trigger, 'Parsley'), event => {
        this._eventValidate(event);
      });
    }
  },

  _eventValidate: function (event) {
    // For keyup, keypress, keydown, input... events that could be a little bit obstrusive
    // do not validate if val length < min threshold on first validation. Once field have been validated once and info
    // about success or failure have been displayed, always validate with this trigger to reflect every yalidation change.
    if (/key|input/.test(event.type))
      if (!(this._ui && this._ui.validationInformationVisible) && this.getValue().length <= this.options.validationThreshold)
        return;

    this.validate();
  },

  _resetUI: function () {
    // Reset all event listeners
    this._failedOnce = false;
    this._actualizeTriggers();

    // Nothing to do if UI never initialized for this field
    if ('undefined' === typeof this._ui)
      return;

    // Reset all errors' li
    this._ui.$errorsWrapper
      .removeClass('filled')
      .children()
      .remove();

    // Reset validation class
    this._resetClass();

    // Reset validation flags and last validation result
    this._ui.lastValidationResult = [];
    this._ui.validationInformationVisible = false;
  },

  _destroyUI: function () {
    this._resetUI();

    if ('undefined' !== typeof this._ui)
      this._ui.$errorsWrapper.remove();

    delete this._ui;
  },

  _successClass: function () {
    this._ui.validationInformationVisible = true;
    this._ui.$errorClassHandler.removeClass(this.options.errorClass).addClass(this.options.successClass);
  },
  _errorClass: function () {
    this._ui.validationInformationVisible = true;
    this._ui.$errorClassHandler.removeClass(this.options.successClass).addClass(this.options.errorClass);
  },
  _resetClass: function () {
    this._ui.$errorClassHandler.removeClass(this.options.successClass).removeClass(this.options.errorClass);
  }
};

export default ParsleyUI;
