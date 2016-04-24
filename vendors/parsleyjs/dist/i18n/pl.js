// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('pl', {
  defaultMessage: "Wartość wygląda na nieprawidłową",
  type: {
    email:        "Wpisz poprawny adres e-mail.",
    url:          "Wpisz poprawny adres URL.",
    number:       "Wpisz poprawną liczbę.",
    integer:      "Dozwolone są jedynie liczby całkowite.",
    digits:       "Dozwolone są jedynie cyfry.",
    alphanum:     "Dozwolone są jedynie znaki alfanumeryczne."
  },
  notblank:       "Pole nie może być puste.",
  required:       "Pole jest wymagane.",
  pattern:        "Pole zawiera nieprawidłową wartość.",
  min:            "Wartość nie może być mniejsza od %s.",
  max:            "Wartość nie może być większa od %s.",
  range:          "Wartość powinna zaweriać się pomiędzy %s a %s.",
  minlength:      "Minimalna ilość znaków wynosi %s.",
  maxlength:      "Maksymalna ilość znaków wynosi %s.",
  length:         "Ilość znaków wynosi od %s do %s.",
  mincheck:       "Wybierz minimalnie %s opcji.",
  maxcheck:       "Wybierz maksymalnie %s opcji.",
  check:          "Wybierz od %s do %s opcji.",
  equalto:        "Wartości nie są identyczne."
});

Parsley.setLocale('pl');
