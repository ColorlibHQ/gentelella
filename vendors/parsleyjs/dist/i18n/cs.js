// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('cs', {
  defaultMessage: "Tato položka je neplatná.",
  type: {
    email:        "Tato položka musí být e-mailová adresa.",
    url:          "Tato položka musí být platná URL adresa.",
    number:       "Tato položka musí být číslo.",
    integer:      "Tato položka musí být celé číslo.",
    digits:       "Tato položka musí být kladné celé číslo.",
    alphanum:     "Tato položka musí být alfanumerická."
  },
  notblank:       "Tato položka nesmí být prázdná.",
  required:       "Tato položka je povinná.",
  pattern:        "Tato položka je neplatná.",
  min:            "Tato položka musí být větší nebo rovna %s.",
  max:            "Tato položka musí být menší nebo rovna %s.",
  range:          "Tato položka musí být v rozsahu od %s do %s.",
  minlength:      "Tato položka musí mít nejméně %s znaků.",
  maxlength:      "Tato položka musí mít nejvíce %s znaků.",
  length:         "Tato položka musí mít délku od %s do %s znaků.",
  mincheck:       "Je nutné vybrat alespoň %s možností.",
  maxcheck:       "Je nutné vybrat nejvýše %s možností.",
  check:          "Je nutné vybrat od %s do %s možností.",
  equalto:        "Tato položka musí být stejná."
});

Parsley.setLocale('cs');
