<template>
  <a-modal
    title="题目设计"
    wrap-class-name="full-modal"
    width="100%"
    :destroyOnClose="true"
    v-model:visible="state.visible"
    :confirmLoading="state.confirmLoading"
    @ok="handleOk"
  >
    <a-form ref="formRef" :model="formState">
      <vuedraggable
        :list="formState"
        @start="state.questionDrag = true"
        @end="state.questionDrag = false"
        item-key="index"
        handle=".ant-divider-inner-text"
      >
        <template #item="{ element, index }">
          <div>
            <a-divider>题目 {{ index + 1 }}</a-divider>
            <a-form-item :rules="formRules.title" :name="[index, 'title']" label="标题">
              <a-input
                style="width: 500px; margin-right: 16px"
                v-model:value="element.title"
                placeholder="请输入"
              ></a-input>
              <a-button type="primary" @click="handleDeleteQuestion(index)">删除题目</a-button>
            </a-form-item>
            <a-form-item :rules="formRules.type" :name="[index, 'type']" label="类型">
              <a-radio-group @change="handleTypeChange(index, element.type)" v-model:value="element.type">
                <a-radio v-for="item in appStore.dict!.question_type" :key="item.id" :value="item.itemValue">
                  {{ item.itemText }}
                </a-radio>
              </a-radio-group>
            </a-form-item>
            <template v-for="(item2, index2) in element.questionOptionList" :key="index2">
              <a-row>
                <a-col>
                  <a-form-item
                    :rules="formRules.questionOptionName"
                    :name="[index, 'questionOptionList', index2, 'name']"
                    label="选项"
                  >
                    <a-input style="width: 500px; margin-right: 16px" v-model:value="item2.name" placeholder="请输入" />
                  </a-form-item>
                </a-col>
                <a-col>
                  <a-form-item>
                    <a-checkbox
                      :checked="!!item2.inputable"
                      @change="(e: any) => formState[index].questionOptionList[index2].inputable = e.target.checked ? 1 : 0"
                    >
                      可输入
                    </a-checkbox>
                  </a-form-item>
                </a-col>
                <a-col>
                  <a-button
                    class="ml8"
                    v-if="element.questionOptionList.length - 1 === index2"
                    @click="handleAddQuestionOption(index)"
                  >
                    添加选项
                  </a-button>
                  <a-button
                    class="ml8"
                    v-if="element.questionOptionList.length - 1 !== index2"
                    @click="handleDeleteQuestionOption(index)"
                  >
                    删除选项
                  </a-button>
                </a-col>
              </a-row>
            </template>
            <a-form-item label="必填">
              <a-switch v-model:checked="element.required" :checkedValue="1" :unCheckedValue="0" />
            </a-form-item>
          </div>
        </template>
        <template #footer>
          <a-button type="primary" @click="handleAddQuestion">添加题目</a-button>
        </template>
      </vuedraggable>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import type { Rule } from "ant-design-vue/es/form";
import { reactive, ref, nextTick } from "vue";
import { message } from "ant-design-vue";
import vuedraggable from "vuedraggable";
import mainService from "@/services/main";
import { useAppStore } from "@/stores/app";

interface QuestionOption {
  questionnaireId: string;
  name: string;
  inputable: number | null;
  sortNo: number | null;
}

interface Question {
  questionnaireId: string;
  title: string;
  type: string;
  required: number | null;
  sortNo: number | null;
  questionOptionList: QuestionOption[];
}

const formRules: Record<string, Rule[]> = {
  title: [{ required: true, message: "请输入标题" }],
  type: [{ required: true, message: "请选择类型" }],
  questionOptionName: [{ required: true, message: "请输入选项" }],
};
const appStore = useAppStore();
const state = reactive({
  visible: false,
  questionDrag: false,
  loadding: false,
  confirmLoading: false,
  questionnaireId: "",
});
const formRef = ref();
const initQuestionOption = () => ({
  questionnaireId: "",
  name: "",
  sortNo: null,
  inputable: 0,
});
const initQuestion = () => ({
  questionnaireId: "",
  title: "",
  type: "",
  required: 1,
  sortNo: null,
  questionOptionList: [],
});
const formState = ref<Question[]>([]);

const fetchData = async () => {
  state.loadding = true;
  const res = await mainService.questionnaireQuestionListWithQuestionOption({
    data: {
      questionnaireId: state.questionnaireId,
    },
  });
  state.loadding = false;

  if (res.data?.code === 200) {
    formState.value = res.data.data;
  }
};

// 新增题目
const handleAddQuestion = () => {
  formState.value.push(initQuestion());
};

// 删除题目
const handleDeleteQuestion = (index: number) => {
  formState.value.splice(index, 1);
};

// 新增选项
const handleAddQuestionOption = (index: number) => {
  formState.value[index].questionOptionList.push(initQuestionOption());
};

// 删除选项
const handleDeleteQuestionOption = (index: number) => {
  formState.value[index].questionOptionList.splice(index, 1);
};

// 问题类型改变监听
const handleTypeChange = (index: number, type: string) => {
  const question = formState.value[index];
  if (type === "input" && question.questionOptionList.length) {
    question.questionOptionList = [];
  } else if ((type === "radio" || type === "checkbox") && !question.questionOptionList.length) {
    question.questionOptionList = [initQuestionOption()];
  }
};

// 打开弹框
const open = async (record: Record<string, any>) => {
  state.questionnaireId = record.id;
  formState.value = [];
  state.visible = true;

  fetchData();
};

// 确定
const handleOk = async () => {
  const res = await formRef.value.validateFields();

  if (!res.errorFields) {
    if (!formState.value.length) {
      message.error("题目数不能为 0");
      return;
    }
    state.confirmLoading = true;

    formState.value.forEach((v, i) => {
      v.sortNo = i + 1;
      v.questionnaireId = state.questionnaireId;
      v.questionOptionList.forEach((vv, ii) => {
        vv.questionnaireId = state.questionnaireId;
        vv.sortNo = ii + 1;
      });
    });
    const res2 = await mainService.questionnaireQuestionSaveBatchWithQuestionOption({
      data: formState.value,
    });
    state.confirmLoading = false;

    if (res2.data?.code === 200) {
      message.success(res2.data.msg);
      state.visible = false;
    }
  }
};

// 需要暴露出去的属性
defineExpose({
  open,
});
</script>

<style scoped lang="less">
:deep(.ant-divider-inner-text) {
  cursor: move;
}
</style>
