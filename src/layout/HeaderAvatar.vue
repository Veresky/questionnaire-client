<template>
  <a-dropdown class="action">
    <div>
      <a-avatar class="avatar" size="small">
        <template #icon>
          <img src="@/assets/img/avatar.png" />
        </template>
      </a-avatar>
      <span class="name anticon">{{ appStore.user?.sysUser?.realname }}</span>
    </div>
    <template #overlay>
      <a-menu class="ant-pro-global-header-right-menu">
        <a-menu-item @click="userModalRef.open">
          <UserOutlined />
          <span>个人信息</span>
        </a-menu-item>
        <a-menu-item @click="passwordUpdateModalRef.open">
          <LockOutlined />
          <span>修改密码</span>
        </a-menu-item>
        <a-menu-divider class="menu-item-divider" />
        <a-menu-item @click="handleLogout">
          <LoginOutlined />
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <user-modal ref="userModalRef" />
  <update-password-modal ref="passwordUpdateModalRef" :onSuccess="handleLogout" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { LoginOutlined, LockOutlined, UserOutlined } from "@ant-design/icons-vue";
import UserModal from "@/layout/UserModal.vue";
import UpdatePasswordModal from "@/layout/UpdatePasswordModal.vue";
import { useAppStore } from "@/stores/app";
import { useRouter } from "vue-router";
import mainService from "@/services/main";
import globalData from "@/utils/globalData";
import storageKey from "@/utils/storageKey";
import store from "store";

const appStore = useAppStore();
const router = useRouter();
const userModalRef = ref();
const passwordUpdateModalRef = ref();

// 登出
const handleLogout = async () => {
  const res2 = await mainService.authLogout();

  if (res2.data?.code === 200) {
    store.remove(storageKey.APP_TOKEN);
    globalData.appToken = "";

    router.push("/auth/login");
  }
};
</script>

<style scoped lang="less">
@import "~ant-design-vue/lib/style/themes/default.less";
.avatar {
  margin-right: 8px;
  color: @primary-color;
  vertical-align: top;
  background: hsla(0, 0%, 100%, 0.85);
}
.menu-item-divider {
  margin: 4px 0;
}
</style>
