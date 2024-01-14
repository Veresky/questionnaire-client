/**
 * i18n国际化
 */
import { createI18n } from "vue-i18n";
import en_US from "@/locale/en_US";
import zh_CN from "@/locale/zh_CN";
import store from "store";
import storageKey from "@/utils/storageKey";

const i18n = createI18n({
  legacy: false, // Must be set to 'false', to use Composition API
  globalInjection: true, // Whether to inject global properties & functions into for each component
  locale: store.get(storageKey.APP_LANG) || "zh_CN", // 语言标识
  messages: {
    zh_CN,
    en_US,
  },
});

export default i18n;
