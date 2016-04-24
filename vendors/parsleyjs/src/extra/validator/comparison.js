// Load this after Parsley for additional comparison validators
// Note: comparing with a reference isn't well supported and not recommended.
import jQuery from 'jquery'; // Remove this line in ES3

// gt, gte, lt, lte, notequalto extra validators
var parseRequirement = function (requirement) {
  if (isNaN(+requirement))
    return parseFloat(jQuery(requirement).val());
  else
    return +requirement;
};

// Greater than validator
window.Parsley.addValidator('gt', {
  validateString: function (value, requirement) {
    return parseFloat(value) > parseRequirement(requirement);
  },
  priority: 32
});

// Greater than or equal to validator
window.Parsley.addValidator('gte', {
  validateString: function (value, requirement) {
    return parseFloat(value) >= parseRequirement(requirement);
  },
  priority: 32
});

// Less than validator
window.Parsley.addValidator('lt', {
  validateString: function (value, requirement) {
    return parseFloat(value) < parseRequirement(requirement);
  },
  priority: 32
});

// Less than or equal to validator
window.Parsley.addValidator('lte', {
  validateString: function (value, requirement) {
    return parseFloat(value) <= parseRequirement(requirement);
  },
  priority: 32
});
