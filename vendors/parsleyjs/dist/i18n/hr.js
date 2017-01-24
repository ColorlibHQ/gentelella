// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('hr', {
  defaultMessage: "Neispravan unos.",
  type: {
    email: "Ovo polje treba sadržavati ispravnu email adresu.",
    url: "Ovo polje treba sadržavati ispravni url.",
    number: "Ovo polje treba sadržavati ispravno upisan broj.",
    integer: "Ovo polje treba sadržavati ispravno upisan cijeli broj.",
    digits: "Ovo polje treba sadržavati znamenke.",
    alphanum: "Ovo polje treba sadržavati brojke ili slova."
  },
  notblank: "Ovo polje ne smije biti prazno.",
  required: "Ovo polje je obavezno.",
  pattern: "Neispravan unos.",
  min: "Vrijednost treba biti jednaka ili veća od %s.",
  max: "Vrijednost treba biti jednaka ili manja od %s.",
  range: "Vrijednost treba biti između %s i %s.",
  minlength: "Unos je prekratak. Treba sadržavati %s ili više znakova.",
  maxlength: "Unos je predugačak. Treba sadržavati %s ili manje znakova.",
  length: "Neispravna duljina unosa. Treba sadržavati između %s i %s znakova.",
  mincheck: "Treba odabrati najmanje %s izbora.",
  maxcheck: "Treba odabrati %s ili manje izbora.",
  check: "Treba odabrati između %s i %s izbora.",
  equalto: "Ova vrijednost treba biti ista."
});

Parsley.setLocale('hr');
