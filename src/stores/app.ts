import { defineStore } from "pinia";
import store from "store";
import type { Locale } from "ant-design-vue/es/locale-provider";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import enUS from "ant-design-vue/es/locale/en_US";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "dayjs/locale/en";
import storageKey from "@/utils/storageKey";
import i18n from "@/utils/i18n";
import mainService from "@/services/main";

export const useAppStore = defineStore({
  id: "app",
  state: () => ({
    user: null as null | Record<string, any>, // 当前用户数据
    dict: null as null | Record<string, any>, // 字典数据
    slideMenuCollapsed: false, // 左侧菜单是否折叠
    language: null as null | Locale, // 多语言
  }),
  actions: {
    // 拉用当前用户数据
    async fetchUserInfo() {
      const res = await mainService.authCurrentUser();

      if (res.data?.code === 200) {
        this.user = res.data.data;
        return true;
      }

      return false;
    },
    // 拉字典数据
    async fetchDict() {
      const res = await mainService.sysDictAll();

      if (res.data?.code === 200) {
        this.dict = res.data.data;
        return true;
      }

      return false;
    },
    // 左侧菜单折叠
    toggleSlideMenuCollapsed() {
      this.slideMenuCollapsed = !this.slideMenuCollapsed;
    },
    // 多语言设置
    setLanguage(lang: string) {
      i18n.global.locale.value = lang;
      store.set(storageKey.APP_LANG, lang);
      if (lang === "zh_CN") {
        dayjs.locale("zh-cn");
        this.language = zhCN;
      } else if (lang === "en_US") {
        dayjs.locale("en");
        this.language = enUS;
      }
    },
  },
});
