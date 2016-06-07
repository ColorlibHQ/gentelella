// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('de', {
  dateiso:  "Die Eingabe muss ein gültiges Datum sein (YYYY-MM-DD).",
  minwords: "Die Eingabe ist zu kurz. Sie muss aus %s oder mehr Wörtern bestehen.",
  maxwords: "Die Eingabe ist zu lang. Sie muss aus %s oder weniger Wörtern bestehen.",
  words:    "Die Länge der Eingabe ist ungültig. Sie muss zwischen %s und %s Wörter enthalten.",
  gt:       "Die Eingabe muss größer sein.",
  gte:      "Die Eingabe muss größer oder gleich sein.",
  lt:       "Die Eingabe muss kleiner sein.",
  lte:      "Die Eingabe muss kleiner oder gleich sein."
});
