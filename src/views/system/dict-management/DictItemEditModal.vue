<template>
  <a-modal
    centered
    :title="state.isAdd ? '新增' : '编辑'"
    v-model:visible="state.visible"
    @ok="handleOk"
    :confirmLoading="state.confirmLoading"
  >
    <a-form ref="formRef" :rules="formRules" :model="formState" :label-col="{ span: 5 }">
      <a-form-item name="itemText" label="字典项名称">
        <a-input v-model:value="formState.itemText" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item name="itemValue" label="字典项值">
        <a-input v-model:value="formState.itemValue" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item name="description" label="描述">
        <a-input v-model:value="formState.description" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item name="sortNo" label="排序">
        <a-input-number v-model:value="formState.sortNo" :min="1" />
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
import { message } from "ant-design-vue";
import _ from "lodash-es";
import mainService from "@/services/main";

const formRules: Record<string, Rule[]> = {
  itemText: [{ required: true, message: "请选择" }],
  itemValue: [{ required: true, message: "请输入" }],
};
const initFormState = () => ({
  id: "",
  dictId: "",
  itemText: "",
  itemValue: "",
  description: "",
  sortNo: null,
  state: "enable",
});
const formRef = ref();
const state = reactive({
  visible: false,
  confirmLoading: false,
  isAdd: true,
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
    const res2 = await mainService.sysDictItemEdit({
      data: formState,
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
const open = async (record: Record<string, any>) => {
  if (record.id) {
    _.each(formState, (v, k) => {
      (formState as any)[k] = record[k];
    });
    state.isAdd = false;
  } else {
    Object.assign(formState, initFormState(), { dictId: record.dictId });
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
