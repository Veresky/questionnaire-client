<template>
  <a-config-provider :locale="appStore.language">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import "./app.less";
import { onMounted } from "vue";
import globalData from "@/utils/globalData";
import storageKey from "@/utils/storageKey";
import utils from "@/utils/utils";
import store from "store";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();

onMounted(async () => {
  // 设备唯一标示 S --
  const appGuid = store.get(storageKey.APP_GUID);
  if (appGuid) {
    globalData.appGuid = appGuid;
  } else {
    globalData.appGuid = utils.guid();
    store.set(storageKey.APP_GUID, globalData.appGuid);
  }
  // 设备唯一标示 E --

  // apptoken S --
  const appToken = store.get(storageKey.APP_TOKEN);
  if (appToken) {
    globalData.appToken = appToken;
  }
  // apptoken E --

  // 设置多语言 S --
  appStore.setLanguage(store.get(storageKey.APP_LANG) || "zh_CN");
  // 设置多语言 E --

  // 字典
  await appStore.fetchDict();
});
</script>

<style lang="less">
html,
body,
#app {
  height: 100%;
}
.ant-pro-global-header-right-menu {
  .ant-dropdown-menu-item {
    min-width: 160px;
    .anticon {
      margin-right: 8px;
    }
  }
}
.ant-tabs-dropdown-menu-item {
  .my-tab-reload-btn {
    margin-right: -12px;
    margin-left: 4px;
    padding: 0 4px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
}
.my-search-from {
  .ant-form-item {
    margin-bottom: 16px;
  }
}
.my-table {
  .ant-table-pagination.ant-pagination {
    margin-bottom: 0;
  }
}
.my-table-top-buttons {
  margin-bottom: 16px;
}
</style>
