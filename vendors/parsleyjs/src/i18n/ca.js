// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('ca', {
  defaultMessage: "Aquest valor sembla ser invàlid.",
  type: {
    email:        "Aquest valor ha de ser una adreça de correu electrònic vàlida.",
    url:          "Aquest valor ha de ser una URL vàlida.",
    number:       "Aquest valor ha de ser un nombre vàlid.",
    integer:      "Aquest valor ha de ser un nombre enter vàlid.",
    digits:       "Aquest valor només pot contenir dígits.",
    alphanum:     "Aquest valor ha de ser alfanumèric."
  },
  notblank:       "Aquest valor no pot ser buit.",
  required:       "Aquest valor és obligatori.",
  pattern:        "Aquest valor és incorrecte.",
  min:            "Aquest valor no pot ser menor que %s.",
  max:            "Aquest valor no pot ser major que %s.",
  range:          "Aquest valor ha d'estar entre %s i %s.",
  minlength:      "Aquest valor és massa curt. La longitud mínima és de %s caràcters.",
  maxlength:      "Aquest valor és massa llarg. La longitud màxima és de %s caràcters.",
  length:         "La longitud d'aquest valor ha de ser d'entre %s i %s caràcters.",
  mincheck:       "Has de marcar un mínim de %s opcions.",
  maxcheck:       "Has de marcar un màxim de %s opcions.",
  check:          "Has de marcar entre %s i %s opcions.",
  equalto:        "Aquest valor ha de ser el mateix."
});

Parsley.setLocale('ca');
