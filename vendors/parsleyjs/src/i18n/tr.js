// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('tr', {
  defaultMessage: "Girdiğiniz değer geçerli değil.",
  type: {
    email:        "Geçerli bir e-mail adresi yazmanız gerekiyor.",
    url:          "Geçerli bir bağlantı adresi yazmanız gerekiyor.",
    number:       "Geçerli bir sayı yazmanız gerekiyor.",
    integer:      "Geçerli bir tamsayı yazmanız gerekiyor.",
    digits:       "Geçerli bir rakam yazmanız gerekiyor.",
    alphanum:     "Geçerli bir alfanümerik değer yazmanız gerekiyor."
  },
  notblank:       "Bu alan boş bırakılamaz.",
  required:       "Bu alan boş bırakılamaz.",
  pattern:        "Girdiğiniz değer geçerli değil.",
  min:            "Bu alan %s değerinden büyük ya da bu değere eşit olmalı.",
  max:            "Bu alan %s değerinden küçük ya da bu değere eşit olmalı.",
  range:          "Bu alan %s ve %s değerleri arasında olmalı.",
  minlength:      "Bu alanın uzunluğu %s karakter veya daha fazla olmalı.",
  maxlength:      "Bu alanın uzunluğu %s karakter veya daha az olmalı.",
  length:         "Bu alanın uzunluğu %s ve %s karakter arasında olmalı.",
  mincheck:       "En az %s adet seçim yapmalısınız.",
  maxcheck:       "En fazla %s seçim yapabilirsiniz.",
  check:          "Bu alan için en az %s, en fazla %s seçim yapmalısınız.",
  equalto:        "Bu alanın değeri aynı olmalı."
});

Parsley.setLocale('tr');
