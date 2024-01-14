<template>
  <a-modal
    centered
    :title="state.isAdd ? '新增' : '编辑'"
    :destroyOnClose="true"
    v-model:visible="state.visible"
    :confirmLoading="state.confirmLoading"
    @ok="handleOk"
  >
    <a-form ref="formRef" :rules="formRules" :model="formState" :label-col="{ span: 4 }">
      <a-form-item name="username" label="账号">
        <a-input :disabled="!state.isAdd" v-model:value="formState.username" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item name="realname" label="名称">
        <a-input v-model:value="formState.realname" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item name="password" label="密码" v-if="state.isAdd">
        <a-input-password
          :visibilityToggle="false"
          v-model:value="formState.password"
          placeholder="请输入"
        ></a-input-password>
      </a-form-item>
      <a-form-item name="state" label="是否启用">
        <a-switch v-model:checked="formState.state" checkedValue="enable" unCheckedValue="disable" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import type { Rule } from "ant-design-vue/es/form";
import { ref, reactive, nextTick } from "vue";
import md5 from "blueimp-md5";
import { message } from "ant-design-vue";
import _ from "lodash-es";
import mainService from "@/services/main";

const formRef = ref();
const formRules: Record<string, Rule[]> = {
  username: [{ required: true, message: "请输入" }],
  realname: [{ required: true, message: "请输入" }],
  password: [{ required: true, message: "请输入" }],
};
const initFormState = () => ({
  id: "",
  username: "",
  realname: "",
  password: "",
  state: "enable",
});
const state = reactive({
  visible: false,
  isAdd: true,
  confirmLoading: false,
});
const formState = reactive(initFormState());
const props = defineProps<{
  onSuccess: () => Promise<void>;
}>();

// 确定
const handleOk = async () => {
  const res = await formRef.value.validateFields();

  if (!res.errorFields) {
    state.confirmLoading = true;

    const res2 = await mainService.syUserEdit({
      data: {
        ...formState,
        password: state.isAdd ? md5(formState.password).toLocaleUpperCase() : undefined,
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
const open = async (record?: Record<string, any>) => {
  if (record) {
    _.each(formState, (v, k) => {
      (formState as any)[k] = record[k];
    });
    state.isAdd = false;
  } else {
    Object.assign(formState, initFormState());
    state.isAdd = true;
  }

  state.visible = true;
};

// 需要暴露出去的属性
defineExpose({
  open,
});
</script>

<style scoped></style>
