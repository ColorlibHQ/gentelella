// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('zh-cn', {
  defaultMessage: "不正确的值",
  type: {
    email:        "请输入一个有效的电子邮箱地址",
    url:          "请输入一个有效的链接",
    number:       "请输入正确的数字",
    integer:      "请输入正确的整数",
    digits:       "请输入正确的号码",
    alphanum:     "请输入字母或数字"
  },
  notblank:       "请输入值",
  required:       "必填项",
  pattern:        "格式不正确",
  min:            "输入值请大于或等于 %s",
  max:            "输入值请小于或等于 %s",
  range:          "输入值应该在 %s 到 %s 之间",
  minlength:      "请输入至少 %s 个字符",
  maxlength:      "请输入至多 %s 个字符",
  length:         "字符长度应该在 %s 到 %s 之间",
  mincheck:       "请至少选择 %s 个选项",
  maxcheck:       "请选择不超过 %s 个选项",
  check:          "请选择 %s 到 %s 个选项",
  equalto:        "输入值不同"
});

Parsley.setLocale('zh-cn');
