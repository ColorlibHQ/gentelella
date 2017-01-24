// ParsleyConfig definition if not already set
// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('es', {
  defaultMessage: "Este valor parece ser inválido.",
  type: {
    email:        "Este valor debe ser un correo válido.",
    url:          "Este valor debe ser una URL válida.",
    number:       "Este valor debe ser un número válido.",
    integer:      "Este valor debe ser un número válido.",
    digits:       "Este valor debe ser un dígito válido.",
    alphanum:     "Este valor debe ser alfanumérico."
  },
  notblank:       "Este valor no debe estar en blanco.",
  required:       "Este valor es requerido.",
  pattern:        "Este valor es incorrecto.",
  min:            "Este valor no debe ser menor que %s.",
  max:            "Este valor no debe ser mayor que %s.",
  range:          "Este valor debe estar entre %s y %s.",
  minlength:      "Este valor es muy corto. La longitud mínima es de %s caracteres.",
  maxlength:      "Este valor es muy largo. La longitud máxima es de %s caracteres.",
  length:         "La longitud de este valor debe estar entre %s y %s caracteres.",
  mincheck:       "Debe seleccionar al menos %s opciones.",
  maxcheck:       "Debe seleccionar %s opciones o menos.",
  check:          "Debe seleccionar entre %s y %s opciones.",
  equalto:        "Este valor debe ser idéntico."
});

Parsley.setLocale('es');
