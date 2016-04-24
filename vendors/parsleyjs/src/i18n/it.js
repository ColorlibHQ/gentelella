// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('it', {
  defaultMessage: "Questo valore sembra essere non valido.",
  type: {
    email:        "Questo valore deve essere un indirizzo email valido.",
    url:          "Questo valore deve essere un URL valido.",
    number:       "Questo valore deve essere un numero valido.",
    integer:      "Questo valore deve essere un numero valido.",
    digits:       "Questo valore deve essere di tipo numerico.",
    alphanum:     "Questo valore deve essere di tipo alfanumerico."
  },
  notblank:       "Questo valore non deve essere vuoto.",
  required:       "Questo valore è richiesto.",
  pattern:        "Questo valore non è corretto.",
  min:            "Questo valore deve essere maggiore di %s.",
  max:            "Questo valore deve essere minore di %s.",
  range:          "Questo valore deve essere compreso tra %s e %s.",
  minlength:      "Questo valore è troppo corto. La lunghezza minima è di %s caratteri.",
  maxlength:      "Questo valore è troppo lungo. La lunghezza massima è di %s caratteri.",
  length:         "La lunghezza di questo valore deve essere compresa fra %s e %s caratteri.",
  mincheck:       "Devi scegliere almeno %s opzioni.",
  maxcheck:       "Devi scegliere al più %s opzioni.",
  check:          "Devi scegliere tra %s e %s opzioni.",
  equalto:        "Questo valore deve essere identico."
});

Parsley.setLocale('it');
