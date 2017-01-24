(function () {
// notequalto extra validators
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.validators = window.ParsleyConfig.validators || {};

// Greater than validator
window.ParsleyConfig.validators.notequalto = {
  fn: function (value, requirement) {
    return value !== ($(requirement).length ? $(requirement).val() : requirement);
  },
  priority: 256
};
})();
