import { defineComponent, reactive, type Component } from "vue";
import { AppstoreOutlined } from "@ant-design/icons-vue";
import { SysModuleItem } from "@/types/app";
import { useAppStore } from "@/stores/app";
import _ from "lodash-es";
import "./index.less";
import { TITLE } from "@/utils/constant";

interface State {
  title: string;
  selectedKeys: string[];
  openKeys: string[];
}

export default defineComponent({
  name: "SlideMenu",
  components: {
    AppstoreOutlined,
  },
  props: {
    firstLinkOfMenu: String,
  },
  setup(props, { expose }) {
    const state: State = reactive({
      title: TITLE,
      selectedKeys: [],
      openKeys: [],
    });
    const appStore = useAppStore();

    // 渲染左侧菜单
    function renderMenu(sysModuleTree: SysModuleItem[]): Component {
      return sysModuleTree.map((sysModule) => {
        const icon = sysModule.icon ? (
          <icon-font type={sysModule.icon} />
        ) : sysModule.parentId == null ? (
          <AppstoreOutlined style="font-size: 13px" />
        ) : null;
        const item = (
          <>
            {icon}
            <span>{sysModule.name}</span>
          </>
        );

        if (sysModule.moduleType === "menu" && !sysModule.hideInMenu) {
          if (!sysModule.children?.length || !sysModule.children.some((v) => v.moduleType === "menu")) {
            return (
              <a-menu-item key={String(sysModule.id)}>
                {/^http/.test(sysModule.path) ? (
                  <a href={sysModule.path} target="_blank">
                    {item}
                  </a>
                ) : (
                  <router-link to={sysModule.path}>{item}</router-link>
                )}
              </a-menu-item>
            );
          } else {
            const slots = {
              title: () => item,
            };

            return (
              <a-sub-menu key={String(sysModule.id)} v-slots={slots}>
                {renderMenu(sysModule.children)}
              </a-sub-menu>
            );
          }
        } else {
          return null;
        }
      });
    }
    // 监听左侧菜单子菜单展开/关闭
    const handleMenuOpenChange = (openKeys: string[]) => {
      state.openKeys = openKeys;
    };
    // 更新组件状态
    const updateSlideMenuState = (sysModules: SysModuleItem[]) => {
      state.selectedKeys = [String(sysModules[sysModules.length - 1].id)];
      setOpenKeysState(sysModules, true);
    };
    // 根据左侧菜单折叠状态设置openKeys状态
    const setOpenKeysState = (sysModules: SysModuleItem[], isAdd = false) => {
      if (appStore.slideMenuCollapsed) {
        state.openKeys = [];
      } else {
        const moduleIds = sysModules.map((v) => String(v.id));
        if (isAdd) {
          state.openKeys = _.union(state.openKeys, moduleIds);
        } else {
          state.openKeys = moduleIds;
        }
      }
    };

    expose({
      updateSlideMenuState,
      setOpenKeysState,
    });

    return () => (
      <a-layout-sider
        collapsible
        trigger={null}
        collapsed={appStore.slideMenuCollapsed}
        collapsed-width="48"
        width="208"
        style="overflow: hidden"
        class="ant-pro-sider ant-pro-sider-dark ant-pro-sider-side ant-pro-sider-fixed"
      >
        <div class="ant-pro-sider-logo">
          <router-link to={props.firstLinkOfMenu}>
            <img src={require("@/assets/img/logo.png")} alt="logo" />
            {appStore.slideMenuCollapsed ? null : <h1>{state.title}</h1>}
          </router-link>
        </div>
        <div style="flex: 1 1 0%; overflow: hidden auto;">
          <a-menu
            onOpenChange={handleMenuOpenChange}
            theme="dark"
            mode="inline"
            inline-indent={16}
            collapsed={appStore.slideMenuCollapsed}
            open-keys={state.openKeys}
            selected-keys={state.selectedKeys}
          >
            {renderMenu(appStore.user?.sysModule)}
          </a-menu>
        </div>
      </a-layout-sider>
    );
  },
});
