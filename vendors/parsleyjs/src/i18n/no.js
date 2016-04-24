// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('no', {
  defaultMessage: "Verdien er ugyldig.",
  type: {
    email:        "Verdien må være en gyldig e-postadresse.",
    url:          "Verdien må være en gyldig url.",
    number:       "Verdien må være et gyldig tall.",
    integer:      "Verdien må være et gyldig heltall.",
    digits:       "Verdien må være et siffer.",
    alphanum:     "Verdien må være alfanumerisk"
  },
  notblank:       "Verdien kan ikke være blank.",
  required:       "Verdien er obligatorisk.",
  pattern:        "Verdien er ugyldig.",
  min:            "Verdien må være større eller lik %s.",
  max:            "Verdien må være mindre eller lik %s.",
  range:          "Verdien må være mellom %s and %s.",
  minlength:      "Verdien er for kort. Den må bestå av minst %s tegn.",
  maxlength:      "Verdien er for lang. Den kan bestå av maksimalt %s tegn.",
  length:         "Verdien har ugyldig lengde. Den må være mellom %s og %s tegn lang.",
  mincheck:       "Du må velge minst %s alternativer.",
  maxcheck:       "Du må velge %s eller færre alternativer.",
  check:          "Du må velge mellom %s og %s alternativer.",
  equalto:        "Verdien må være lik."
});

Parsley.setLocale('no');
