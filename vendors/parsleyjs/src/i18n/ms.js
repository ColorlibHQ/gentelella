// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('ms', {
  defaultMessage: "Nilai tidak sah.",
  type: {
    email:        "Nilai mestilah dalam format emel yang sah.",
    url:          "Nilai mestilah dalam bentuk url yang sah.",
    number:       "Hanya nombor dibenarkan.",
    integer:      "Hanya integer dibenarkan.",
    digits:       "Hanya angka dibenarkan.",
    alphanum:     "Hanya alfanumerik dibenarkan."
  },
  notblank:       "Nilai ini tidak boleh kosong.",
  required:       "Nilai ini wajib diisi.",
  pattern:        "Bentuk nilai ini tidak sah.",
  min:            "Nilai perlu lebih besar atau sama dengan %s.",
  max:            "Nilai perlu lebih kecil atau sama dengan %s.",
  range:          "Nilai perlu berada antara %s hingga %s.",
  minlength:      "Nilai terlalu pendek. Ianya perlu sekurang-kurangnya %s huruf.",
  maxlength:      "Nilai terlalu panjang. Ianya tidak boleh melebihi %s huruf.",
  length:         "Panjang nilai tidak sah. Panjangnya perlu diantara %s hingga %s huruf.",
  mincheck:       "Anda mesti memilih sekurang-kurangnya %s pilihan.",
  maxcheck:       "Anda tidak boleh memilih lebih daripada %s pilihan.",
  check:          "Anda mesti memilih diantara %s hingga %s pilihan.",
  equalto:        "Nilai dimasukkan hendaklah sama."
});

Parsley.setLocale('ms');
