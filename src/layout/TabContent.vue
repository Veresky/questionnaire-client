<template>
  <a-tabs hide-add type="editable-card" :activeKey="state.tabActiveKey" @change="handleTabChange" @edit="handleTabEdit">
    <a-tab-pane
      v-for="pane in state.tabPanes"
      :key="pane.routePath"
      :forceRender="true"
      :closable="state.tabPanes.length > 1"
    >
      <template #tab>
        <span class="my-tab-text">{{ pane.name }}</span>
        <ReloadOutlined
          class="my-tab-reload-btn"
          @click="handleRefreshCurrentTab(pane)"
          v-if="state.tabActiveKey === pane.routePath"
        />
      </template>
      <div class="my-content-box">
        <component :is="pane.component" v-if="!pane.refreshing" />
      </div>
    </a-tab-pane>
    <template #renderTabBar="{ DefaultTabBar, ...props }">
      <div style="height: 38px; background: transparent"></div>
      <div
        class="my-tabs-nav"
        :style="{
          width: 'calc(100% - ' + (appStore.slideMenuCollapsed ? 48 : 208) + 'px)',
        }"
      >
        <component :is="DefaultTabBar" v-bind="props" />
        <a-dropdown>
          <EllipsisOutlined :rotate="90" class="ant-pro-multi-tab-dropdown-menu-btn" />
          <template #overlay>
            <a-menu @click="handleTabExtraClick">
              <a-menu-item key="closeOther" :disabled="state.tabPanes.length > 1 ? false : true">关闭其他</a-menu-item>
              <a-menu-item key="refreshCurrent">刷新当前页</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </template>
  </a-tabs>
</template>

<script setup lang="ts">
import { reactive, nextTick } from "vue";
import { useRouter } from "vue-router";
import { ReloadOutlined, EllipsisOutlined } from "@ant-design/icons-vue";
import { TabPane } from "@/types/app";
import { useAppStore } from "@/stores/app";

interface State {
  tabPanes: TabPane[];
  tabActiveKey: string;
}

const router = useRouter();
const appStore = useAppStore();
const state: State = reactive({
  tabPanes: [],
  tabActiveKey: "",
});

// tabs栏，新增或删除tab
const handleTabEdit = (targetKey: string, action: string) => {
  if (action === "remove") {
    // 关闭tab
    let lastIndex = 0;
    const newTabPanes: TabPane[] = [];
    state.tabPanes.forEach((pane, i) => {
      if (pane.routePath === targetKey) {
        lastIndex = i - 1;
      } else {
        newTabPanes.push(pane);
      }
    });

    // 关闭当前tab
    if (state.tabActiveKey === targetKey) {
      if (lastIndex < 0) lastIndex = 1;
      router.push(state.tabPanes[lastIndex].routePath);
    }

    state.tabPanes = newTabPanes;
  }
};
// 切换tab
const handleTabChange = (targetKey: string) => {
  router.push(targetKey);
};
// 刷新当前tab
const handleRefreshCurrentTab = async (tabPane: TabPane) => {
  tabPane.refreshing = true;
  await nextTick();
  tabPane.refreshing = false;
};
// tabs右侧下拉框点击
const handleTabExtraClick = ({ key }: { key: string }) => {
  const tabPanes = state.tabPanes.filter((v) => state.tabActiveKey === v.routePath);

  if (key === "closeOther") {
    state.tabPanes = tabPanes;
  } else if (key === "refreshCurrent") {
    handleRefreshCurrentTab(tabPanes[0]);
  }
};

// 更新组件状态
const updateTabContentState = (tabPane: TabPane) => {
  const existsTab = state.tabPanes.find((v) => v.routePath === tabPane.routePath);

  // 新开tab
  if (!existsTab) {
    state.tabPanes.push(tabPane);
  }

  state.tabActiveKey = tabPane.routePath;
};

defineExpose({
  updateTabContentState,
});
</script>

<style scoped lang="less">
@import "~ant-design-vue/lib/style/themes/default.less";
.my-tabs-nav {
  position: fixed;
  top: 48px;
  z-index: 9;
  display: flex;
  background: #fff;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  height: 38px;
  transition: width 0.2s;
  :deep(.ant-tabs-nav) {
    margin-bottom: 0;
    width: calc(100% - 46px);
    &::before {
      display: none;
    }
    .ant-tabs-nav-list {
      padding: 4px 7px 0px 10px;
      .ant-tabs-tab {
        height: 30px;
        line-height: 30px;
        padding: 8px 12px;
        background: #ffffff;
        border-radius: 3px;
        border: 1px solid #dbdbdb;
        position: relative;
        margin-right: 3px;
        border-radius: 3px;
        .ant-tabs-tab-btn {
          display: flex;
          align-items: center;
        }
        .ant-tabs-tab-remove {
          height: 30px;
          padding: 0 4px;
          margin: 0 -4px 0 0;
          display: flex;
          align-items: center;
        }
        &.ant-tabs-tab-active {
          background: @primary-color;
          border-color: @primary-color;
          .ant-tabs-tab-remove {
            color: #ffffff;
          }
          .ant-tabs-tab-btn {
            color: #ffffff;
          }
        }
        .my-tab-text {
          line-height: 1;
        }
        .my-tab-reload-btn {
          margin-right: 0;
          margin-left: 4px;
          padding: 0 4px;
          font-size: 12px;
        }
      }
    }
  }
}
.ant-pro-multi-tab-dropdown-menu-btn {
  margin-right: 8px;
  padding: 12px;
  font-size: 14px;
  cursor: pointer;
}
.my-content-box {
  padding: 16px 16px 0;
}
</style>
