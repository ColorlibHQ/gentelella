// All these options could be overriden and specified directly in DOM using
// `data-parsley-` default DOM-API
// eg: `inputs` can be set in DOM using `data-parsley-inputs="input, textarea"`
// eg: `data-parsley-stop-on-first-failing-constraint="false"`

var ParsleyDefaults = {
  // ### General

  // Default data-namespace for DOM API
  namespace: 'data-parsley-',

  // Supported inputs by default
  inputs: 'input, textarea, select',

  // Excluded inputs by default
  excluded: 'input[type=button], input[type=submit], input[type=reset], input[type=hidden]',

  // Stop validating field on highest priority failing constraint
  priorityEnabled: true,

  // ### Field only

  // identifier used to group together inputs (e.g. radio buttons...)
  multiple: null,

  // identifier (or array of identifiers) used to validate only a select group of inputs
  group: null,

  // ### UI
  // Enable\Disable error messages
  uiEnabled: true,

  // Key events threshold before validation
  validationThreshold: 3,

  // Focused field on form validation error. 'first'|'last'|'none'
  focus: 'first',

  // event(s) that will trigger validation before first failure. eg: `input`...
  trigger: false,

  // event(s) that will trigger validation after first failure.
  triggerAfterFailure: 'input',

  // Class that would be added on every failing validation Parsley field
  errorClass: 'parsley-error',

  // Same for success validation
  successClass: 'parsley-success',

  // Return the `$element` that will receive these above success or error classes
  // Could also be (and given directly from DOM) a valid selector like `'#div'`
  classHandler: function (ParsleyField) {},

  // Return the `$element` where errors will be appended
  // Could also be (and given directly from DOM) a valid selector like `'#div'`
  errorsContainer: function (ParsleyField) {},

  // ul elem that would receive errors' list
  errorsWrapper: '<ul class="parsley-errors-list"></ul>',

  // li elem that would receive error message
  errorTemplate: '<li></li>'
};

export default ParsleyDefaults;
