/**
 * 方法集合
 */

// 随机生成一个4位字符
function S4(): string {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

const utils = {
  // 生成GUID
  guid(): string {
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
  },
  // 手机号隐藏中间4位
  hidePhoneMiddle(phone = ""): string {
    return phone.replace(/(\d{3})(\d{4})(\d{4})/g, (word, $1, $2, $3) => $1 + "****" + $3);
  },

  // 过滤对象中的空数据
  filterEmpty<T extends object, K extends keyof T>(data: T): T {
    Object.keys(data).forEach((k) => {
      const value = data[k as K] as any;
      if (value === "" || value == null) {
        delete data[k as K];
      }
    });

    return data;
  },

  // 触发窗口resize
  triggerResizeEvent(): void {
    const event = new Event("resize", { bubbles: true, cancelable: false });
    window.dispatchEvent(event);
  },
};

export default utils;
