<template>
  <a-layout v-if="appStore.user" class="ant-pro-basic-layout">
    <div
      class="ant-pro-fixed-stuff"
      :style="{ width: appStore.slideMenuCollapsed ? '48px' : '208px', overflow: 'hidden' }"
    />
    <SlideMenu ref="slideMenuRef" :firstLinkOfMenu="firstLinkOfMenu" />
    <a-layout style="position: relative">
      <HeaderBar ref="headerBarRef" :firstLinkOfMenu="firstLinkOfMenu" :slideMenuRef="slideMenuRef" />
      <a-layout-content>
        <TabContent ref="tabContentRef" />
      </a-layout-content>
      <a-layout-footer class="ant-pro-footer">
        <DefaultFooter />
      </a-layout-footer>
    </a-layout>
  </a-layout>
  <a-spin v-else class="ant-pro-basic-layout-pre-loading" size="large"></a-spin>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, computed, watch } from "vue";
import { useRouter, useRoute, RouteLocationNormalized } from "vue-router";
import SlideMenu from "@/layout/slide-menu/SlideMenu";
import HeaderBar from "@/layout/HeaderBar.vue";
import TabContent from "@/layout/TabContent.vue";
import DefaultFooter from "@/components/DefaultFooter.vue";
import _ from "lodash-es";
import globalData from "@/utils/globalData";
import { SysModuleItem, TabPane } from "@/types/app";
import { useAppStore } from "@/stores/app";
import utils from "@/utils/utils";

const slideMenuRef = ref();
const headerBarRef = ref();
const tabContentRef = ref();
const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
// 菜单List数据
const menuList = computed(() => {
  let tmp: SysModuleItem[] = [];
  const ret: SysModuleItem[] = [];
  if (appStore.user) {
    tmp = tmp.concat(appStore.user.sysModule);
  }
  while (tmp.length) {
    const first = tmp.shift() as SysModuleItem;

    if (first.children) {
      tmp = tmp.concat(first.children);
    }

    ret.push(first);
  }
  return ret;
});

// 菜单中第一个链接
const firstLinkOfMenu = computed(() => {
  let menu = menuList.value.find((v) => v.path);
  return menu ? menu.path : "";
});

// 通过模块List数据和当前路由设置state的一些状态
function setStateThroughModuleAndPath(route: RouteLocationNormalized) {
  // 通过当前匹配的path查找对应的模块，并且生产当前tabPane数据 -- S --
  const matcheds = route.matched;
  const lastMatched = matcheds[matcheds.length - 1];

  let tabPane!: TabPane;
  let sysModule = menuList.value.find((item) => {
    if (item.path === lastMatched.path) {
      tabPane = _.extend({}, item, {
        component: shallowRef(lastMatched.components?.default),
        routePath: route.path,
        refreshing: false,
      });

      return item;
    }
  });
  // 通过当前匹配的path查找对应的模块，并且生产当前tabPane数据 -- E --
  if (sysModule) {
    const sysModules = [sysModule];

    // 查找父级模块
    while (sysModule?.parentId != null) {
      // 通过当前module的parentId递归查询父级module
      sysModule = menuList.value.find((item) => {
        if (item.id === sysModule?.parentId) return item;
      });

      if (sysModule) sysModules.unshift(sysModule);
    }

    // 更新菜单状态
    slideMenuRef.value.updateSlideMenuState(sysModules);
    // 更新头部状态
    headerBarRef.value.updateHeaderBarState(sysModules);
    // 更新内容区域状态
    tabContentRef.value.updateTabContentState(tabPane);

    utils.triggerResizeEvent();
  } else {
    if (route.path === "/") {
      // 路径"/"重定向到菜单第一项
      router.replace(firstLinkOfMenu.value);
    } else {
      // 跳401
    }
  }
}

watch(route, (to, from) => {
  setStateThroughModuleAndPath(to);
});

onMounted(async () => {
  if (globalData.appToken) {
    const p1 = appStore.fetchUserInfo();
    const res = await Promise.all([p1]);

    if (res[0]) {
      setStateThroughModuleAndPath(route);
    }
  } else {
    router.push("/auth/login");
  }
});
</script>

<style scoped lang="less">
.ant-pro-basic-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
  .ant-pro-fixed-stuff {
    flex-shrink: 0;
    transition: width 0.2s;
  }
}
.ant-pro-basic-layout-pre-loading {
  display: flex;
  justify-content: center;
  padding-top: 250px;
}
.ant-pro-footer {
  padding: 0px;
}
</style>
