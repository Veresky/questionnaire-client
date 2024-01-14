<template>
  <a-layout-header style="height: 48px; line-height: 48px; background: transparent" />
  <a-layout-header
    class="ant-pro-fixed-header"
    :style="{
      padding: '0px',
      height: '48px',
      'line-height': '48px',
      width: 'calc(100% - ' + (appStore.slideMenuCollapsed ? 48 : 208) + 'px)',
      'z-index': 9,
    }"
  >
    <div class="ant-pro-global-header">
      <div class="left">
        <span class="menu-fold" @click="handleMenuCollapse">
          <MenuUnfoldOutlined v-show="appStore.slideMenuCollapsed" />
          <MenuFoldOutlined v-show="!appStore.slideMenuCollapsed" />
        </span>
        <Breadcrumb :firstLinkOfMenu="firstLinkOfMenu" :breadcrumbData="state.breadcrumbData" />
      </div>
      <div style="flex: 1 1 0%"></div>
      <a-space size="8" class="right">
        <span class="action"><QuestionCircleOutlined /></span>
        <HeaderAvatar />
        <HeaderI18n />
      </a-space>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { MenuUnfoldOutlined, MenuFoldOutlined, QuestionCircleOutlined } from "@ant-design/icons-vue";
import Breadcrumb from "@/layout/Breadcrumb.vue";
import HeaderAvatar from "@/layout/HeaderAvatar.vue";
import HeaderI18n from "@/layout/HeaderI18n.vue";
import utils from "@/utils/utils";
import { useAppStore } from "@/stores/app";
import { SysModuleItem } from "@/types/app";
import { reactive } from "vue";

interface State {
  breadcrumbData: SysModuleItem[];
}

const appStore = useAppStore();
const state: State = reactive({
  breadcrumbData: [],
});

const props = defineProps<{
  firstLinkOfMenu: string;
  slideMenuRef: any;
}>();

// 左侧菜单折叠
const handleMenuCollapse = () => {
  appStore.toggleSlideMenuCollapsed();
  props.slideMenuRef.setOpenKeysState(state.breadcrumbData);
  utils.triggerResizeEvent();
};

// 更新组件状态
const updateHeaderBarState = (sysModules: SysModuleItem[]) => {
  state.breadcrumbData = sysModules;
};

defineExpose({
  updateHeaderBarState,
});
</script>

<style scoped lang="less">
.ant-pro-fixed-header {
  position: fixed;
  top: 0;
  transition: width 0.2s;
}
.ant-pro-global-header {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid rgba(61, 61, 61, 0.1);
}
.ant-pro-global-header > * {
  height: 100%;
}
.left {
  display: flex;
  align-items: center;
}
.menu-fold {
  padding-right: 16px;
  cursor: pointer;
}
.right {
  display: flex;
  float: right;
  height: 48px;
  margin-left: auto;
  overflow: hidden;
  :deep(.action) {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 12px;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      background-color: rgba(0, 0, 0, 0.025);
    }
    span {
      vertical-align: middle;
    }
  }
}
</style>
