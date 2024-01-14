/**
 * 正则规则
 */

const ruleUtils = {
  // 必填
  isRequired(text: string): boolean {
    return text != undefined && text !== "";
  },
  // 姓名
  isName(name: string): boolean {
    return /^[a-zA-Z\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(name);
  },
  // 验证码
  isVerificationCode(code: string): boolean {
    return /^\d{6}$/.test(code);
  },
  // 电话号码
  isPhoneNumber(phone: string): boolean {
    return /^1[3456789]\d{9}$/.test(phone);
  },
  // 密码
  isPassword(password: string): boolean {
    return /^(?![^a-zA-Z]+$)(?!\D+$)/.test(password) && password.length >= 6 && password.length <= 20;
  },
  // 身份证
  isIdCard(idCard: string): boolean {
    const WI = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
    const CODE = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;

    for (let i = 0; i < 17; i += 1) {
      sum += WI[i] * +idCard[i];
    }

    if (idCard[17].toUpperCase() !== String(CODE[sum % 11])) return false;

    return true;
  },
  // 纳税人识别号
  isTaxNo(taxNo: string): boolean {
    return /^[a-zA-Z0-9]{15}$|^[a-zA-Z0-9]{18}$/.test(taxNo);
  },
};

export default ruleUtils;
