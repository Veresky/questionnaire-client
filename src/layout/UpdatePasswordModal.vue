<template>
  <a-modal
    centered
    title="修改密码"
    v-model:visible="state.visible"
    @ok="handleOk"
    :confirmLoading="state.confirmLoading"
  >
    <a-form ref="formRef" :rules="formRules" :model="formState" :label-col="{ span: 4 }">
      <a-form-item name="oldPassword" label="旧密码">
        <a-input-password v-model:value="formState.oldPassword" placeholder="请输入"></a-input-password>
      </a-form-item>
      <a-form-item name="newPassword" label="新密码">
        <a-input-password v-model:value="formState.newPassword" placeholder="请输入"></a-input-password>
      </a-form-item>
      <a-form-item name="checkNewPassword" label="确认密码">
        <a-input-password v-model:value="formState.checkNewPassword" placeholder="请输入"></a-input-password>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import type { Rule } from "ant-design-vue/es/form";
import { reactive, ref, nextTick } from "vue";
import { message } from "ant-design-vue";
import mainService from "@/services/main";
import md5 from "blueimp-md5";

const initFormState = () => ({
  oldPassword: "",
  newPassword: "",
  checkNewPassword: "",
});
const formRef = ref();
const state = reactive({
  visible: false,
  confirmLoading: false,
});
const formState = reactive(initFormState());
const props = defineProps<{
  onSuccess: () => Promise<void>;
}>();

const validateNewPassword = async (_rule: Rule, value: string) => {
  if (value === "") {
    return Promise.reject("请输入");
  } else {
    if (formState.checkNewPassword !== "") {
      formRef.value.validateFields("checkNewPassword");
    }
    return Promise.resolve();
  }
};
const validateCheckNewPassword = async (_rule: Rule, value: string) => {
  if (value === "") {
    return Promise.reject("请输入");
  } else if (value !== formState.newPassword) {
    return Promise.reject("两次密码不一致");
  } else {
    return Promise.resolve();
  }
};
const formRules: Record<string, Rule[]> = {
  oldPassword: [{ required: true, message: "请输入" }],
  newPassword: [{ required: true, validator: validateNewPassword, trigger: "change" }],
  checkNewPassword: [{ required: true, validator: validateCheckNewPassword, trigger: "change" }],
};

// 确定
const handleOk = async () => {
  const res = await formRef.value.validateFields();

  if (!res.errorFields) {
    state.confirmLoading = true;

    const res2 = await mainService.sysUserUpdatePassword({
      data: {
        oldPassword: md5(formState.oldPassword).toLocaleUpperCase(),
        newPassword: md5(formState.newPassword).toLocaleUpperCase(),
      },
    });
    state.confirmLoading = false;

    if (res2.data?.code === 200) {
      message.success(res2.data.msg);
      state.visible = false;

      props.onSuccess();
    }
  }
};

// 打开弹框
const open = () => {
  Object.assign(formState, initFormState());
  state.visible = true;
};

// 需要暴露出去的属性
defineExpose({
  open,
});
</script>

<style scoped></style>
