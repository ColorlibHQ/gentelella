// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('sq', {
  defaultMessage: "Kjo vlere eshte e pasakte.",
  type: {
    email:        "Duhet te jete nje email i vlefshem.",
    url:          "Duhet te jete nje URL e vlefshme.",
    number:       "Duhet te jete numer.",
    integer:      "Kjo vlere duhet te jete integer.",
    digits:       "Kjo vlere duhet te permbaje digit.",
    alphanum:     "Kjo vlere duhet te permbaje vetel alphanumeric."
  },
  notblank:       "Nuk mund te lihet bosh.",
  required:       "Eshte e detyrueshme.",
  pattern:        "Kjo vlere eshte e pasakte.",
  min:            "Duhet te jete me e madhe ose baraz me %s.",
  max:            "Duhet te jete me e vogel ose baraz me %s.",
  range:          "Duhet te jete midis %s dhe %s.",
  minlength:      "Kjo vlere eshte shume e shkurter. Ajo duhet te permbaje min %s karaktere.",
  maxlength:      "Kjo vlere eshte shume e gjate. Ajo duhet te permbaje max %s karaktere.",
  length:         "Gjatesia e kesaj vlere eshte e pasakte. Ajo duhet te jete midis %s dhe %s karakteresh.",
  mincheck:       "Ju duhet te zgjidhni te pakten %s vlere.",
  maxcheck:       "Ju duhet te zgjidhni max %s vlera.",
  check:          "Ju mund te zgjidhni midis %s dhe %s vlerash.",
  equalto:        "Kjo vlere duhet te jete e njejte."
});

Parsley.setLocale('sq');
