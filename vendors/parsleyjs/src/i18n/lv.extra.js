// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('lv', {
  dateiso:  "Šai vērtībai jābūt korekti noformētam datumam (YYYY-MM-DD).",
  minwords: "Šī vērtība ir par īsu. Tai jābūt vismaz %s vārdus garai.",
  maxwords: "Šī vērtība ir par garu. Tai jābūt %s vārdus garai vai īsākai.",
  words:    "Šīs vērtības garums ir nederīgs. Tai jābūt no %s līdz %s vārdus garai.",
  gt:       "Šai vērtībai jābūt lielākai.",
  gte:      "Šai vērtībai jābūt lielākai vai vienādai.",
  lt:       "Šai vērtībai jābūt mazākai.",
  lte:      "Šai vērtībai jābūt mazākai vai vienādai.",
  notequalto: "Šai vērtībai jābūt atšķirīgai."
});
