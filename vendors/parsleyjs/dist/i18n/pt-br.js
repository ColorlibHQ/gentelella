// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('pt-br', {
  defaultMessage: "Este valor parece ser inválido.",
  type: {
    email:        "Este campo deve ser um email válido.",
    url:          "Este campo deve ser um URL válida.",
    number:       "Este campo deve ser um número válido.",
    integer:      "Este campo deve ser um inteiro válido.",
    digits:       "Este campo deve conter apenas dígitos.",
    alphanum:     "Este campo deve ser alfa numérico."
  },
  notblank:       "Este campo não pode ficar vazio.",
  required:       "Este campo é obrigatório.",
  pattern:        "Este campo parece estar inválido.",
  min:            "Este campo deve ser maior ou igual a %s.",
  max:            "Este campo deve ser menor ou igual a %s.",
  range:          "Este campo deve estar entre %s e %s.",
  minlength:      "Este campo é pequeno demais. Ele deveria ter %s caracteres ou mais.",
  maxlength:      "Este campo é grande demais. Ele deveria ter %s caracteres ou menos.",
  length:         "O tamanho deste campo é inválido. Ele deveria ter entre %s e %s caracteres.",
  mincheck:       "Você deve escolher pelo menos %s opções.",
  maxcheck:       "Você deve escolher %s opções ou mais",
  check:          "Você deve escolher entre %s e %s opções.",
  equalto:        "Este valor deveria ser igual."
});

Parsley.setLocale('pt-br');
