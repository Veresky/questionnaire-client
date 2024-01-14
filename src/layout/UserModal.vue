<template>
  <a-modal centered title="个人信息" v-model:visible="state.visible">
    <a-form :label-col="{ span: 4 }">
      <a-form-item label="名称">{{ appStore?.user?.sysUser.realname }}</a-form-item>
      <a-form-item label="账号">{{ appStore?.user?.sysUser.username }}</a-form-item>
      <a-form-item label="角色">{{ appStore?.user?.sysRole.map((v: any) => v.roleName).join(",") }}</a-form-item>
      <a-form-item label="状态" class="">
        <a-tag v-if="appStore?.user?.sysUser.state === 'enable'" color="#87d068">
          {{ appStore.dict!.user_state.find((v: any) => v.itemValue === appStore?.user?.sysUser.state).itemText }}
        </a-tag>
        <a-tag v-else color="pink">
          {{ appStore.dict!.user_state.find((v: any) => v.itemValue === appStore?.user?.sysUser.state).itemText }}
        </a-tag>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="primary" @click="handleCancel">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const state = reactive({
  visible: false,
});

// 取消
const handleCancel = async () => {
  state.visible = false;
};

// 打开弹框
const open = () => {
  state.visible = true;
};

// 需要暴露出去的属性
defineExpose({
  open,
});
</script>

<style scoped lang="less">
:deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>
