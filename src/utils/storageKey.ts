/**
 * 本地缓存存储key
 * "APP_KEY" 全局以'APP'开始
 * "PAGE_PAGENAME_KEY" 页面级别以'PAGE_{PAGENAME}'开始
 * "UTIL_FILENAME_KEY" 工具级别以'UTIL_{FILENAME}'开始
 */
import store from "store";

// 登出需要清除的缓存key
const storageKeyOfLogoutNeedClear = {
  APP_TOKEN: "APP_TOKEN", // apptoken
};

// 登出不需要清除的缓存key
const storageKeyOfLogoutNotNeedClear = {
  APP_GUID: "APP_GUID", // 不清缓存情况下的设备唯一标示
  APP_LANG: "APP_LANG", // 当前语言
};

const storageKey = {
  ...storageKeyOfLogoutNeedClear,
  ...storageKeyOfLogoutNotNeedClear,
};
export default storageKey;

// 登出时清除相应的storage
export const clearStorageForLogout = () => {
  for (const key in storageKeyOfLogoutNeedClear) {
    store.remove(key);
  }
};
