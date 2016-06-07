// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('lt', {
  defaultMessage: "Šis įrašas neteisingas.",
  type: {
    email:        "Šis įrašas nėra teisingas el. paštas.",
    url:          "Šis įrašas nėra teisingas url.",
    number:       "Šis įrašas nėra skaičius.",
    integer:      "Šis įrašas nėra sveikasis skaičius.",
    digits:       "Šis įrašas turi būti skaičius.",
    alphanum:     "Šis įrašas turi būti iš skaičių ir raidžių."
  },
  notblank:       "Šis įrašas negali būti tuščias.",
  required:       "Šis įrašas yra privalomas",
  pattern:        "Šis įrašas neteisingas.",
  min:            "Ši vertė turi būti didesnė arba lygi %s.",
  max:            "Ši vertė turi būti mažesnė arba lygi %s.",
  range:          "Ši vertė turi būti tarp %s ir %s.",
  minlength:      "Šis įrašas per trumpas. Jis turi turėti %s simbolius arba daugiau.",
  maxlength:      "Šis įrašas per ilgas. Jis turi turėti %s simbolius arba mažiau.",
  length:         "Šio įrašo ilgis neteisingas. Jis turėtų būti tarp %s ir %s simbolių.",
  mincheck:       "Jūs turite pasirinkti bent %s pasirinkimus.",
  maxcheck:       "Jūs turite pasirinkti ne daugiau %s pasirinkimų.",
  check:          "Jūs turite pasirinkti tarp %s ir %s pasirinkimų.",
  equalto:        "Ši reikšmė turėtų būti vienoda."
});

Parsley.setLocale('lt');
