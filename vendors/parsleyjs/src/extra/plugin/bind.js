// This plugin replace Parsley default form behavior that auto bind its fields children
// With this plugin you must register in constructor your form's fields and their constraints
// You have this way a total javascript control over your form validation, and nothing needed in DOM

import jQuery from 'jquery'; // Remove this line in ES3

(function ($) {

  window.ParsleyConfig = $.extend(true, window.ParsleyConfig, {autoBind: false});
  window.ParsleyExtend = window.ParsleyExtend || {};

  window.ParsleyExtend = $.extend(window.ParsleyExtend, {
    // { '#selector' : { constraintName1: value, constraintName2: value2 }, #selector2: { constraintName: value } }
    // { '#selector' : { constraintName1: { requirements: value, priority: value }, constraintName2: value2 } }
    _bindFields: function () {
      if ('ParsleyForm' !== this.__class__)
        throw new Error('`_bindFields` must be called on a form instance');

      if ('undefined' === typeof this.options.fields)
        throw new Error('bind.js plugin needs to have Parsley instantiated with fields');

      var field;
      this.fields = [];

      for (var selector in this.options.fields) {
        if (0 === $(selector).length)
          continue;

        field = $(selector).parsley();

        for (var name in this.options.fields[selector]) {
          if ('object' === typeof this.options.fields[selector][name] && !(this.options.fields[selector][name] instanceof Array))
            field.addConstraint(name.toLowerCase(), this.options.fields[selector][name].requirements, this.options.fields[selector][name].priority || 32);
          else
            field.addConstraint(name.toLowerCase(), this.options.fields[selector][name]);
        }
      }

      this.fields.push(field);

      return this;
    },

    // Do nothing
    _bindConstraints: function () {
      return this;
    }
  });

})(jQuery);
