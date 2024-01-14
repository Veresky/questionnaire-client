<template>
  <a-modal
    centered
    :title="state.isAdd ? '新增' : '编辑'"
    :destroyOnClose="true"
    v-model:visible="state.visible"
    :confirmLoading="state.confirmLoading"
    @ok="handleOk"
  >
    <a-form ref="formRef" :rules="formRules" :model="formState" :label-col="{ span: 5 }">
      <a-form-item name="title" label="标题">
        <a-input v-model:value="formState.title" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item name="description" label="描述">
        <a-textarea v-model:value="formState.description" placeholder="请输入"></a-textarea>
      </a-form-item>
      <a-form-item name="startTime" label="开始时间">
        <a-date-picker
          v-model:value="formState.startTime"
          show-time
          :format="DATE_FORMAT_1"
          :value-format="DATE_FORMAT_1"
        />
      </a-form-item>
      <a-form-item name="endTime" label="结束时间">
        <a-date-picker
          v-model:value="formState.endTime"
          show-time
          :format="DATE_FORMAT_1"
          :value-format="DATE_FORMAT_1"
        />
      </a-form-item>
      <a-form-item name="submitTip" label="提交提示语">
        <a-input v-model:value="formState.submitTip" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item name="collectionLimit" label="回收限制">
        <a-input-number v-model:value="formState.collectionLimit" :min="0" /> 份
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import type { Rule } from "ant-design-vue/es/form";
import { ref, reactive } from "vue";
import { message } from "ant-design-vue";
import _ from "lodash-es";
import mainService from "@/services/main";
import { DATE_FORMAT_1 } from "@/utils/constant";

const formRef = ref();
const formRules: Record<string, Rule[]> = {
  title: [{ required: true, message: "请输入" }],
  submitTip: [{ required: true, message: "请输入" }],
};
const initFormState = () => ({
  id: "",
  title: "",
  description: "",
  startTime: "",
  endTime: "",
  submitTip: "感谢您的参与！",
  collectionLimit: null,
  state: "not_published",
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

    const res2 = await mainService.questionnaireQuestionnaireEdit({
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
