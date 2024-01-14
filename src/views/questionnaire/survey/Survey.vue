<template>
  <div class="survey_page">
    <div class="complete" v-if="state.complete">{{ state.questionnaire.submitTip }}</div>
    <a-spin v-else-if="state.loadding" class="loading" size="large"></a-spin>
    <template v-else>
      <a-form class="form" layout="vertical" ref="formRef" :model="formState">
        <a-divider>{{ state.questionnaire.title }}</a-divider>
        <div class="tip">{{ state.tip }}</div>
        <div class="description">{{ state.questionnaire.description }}</div>
        <template v-for="(item, index) in state.questionnaire.questionList" :key="item.id">
          <div v-if="item.type === 'radio'">
            <a-form-item
              :name="[item.id, 'optionId']"
              :rules="[{ required: !!item.required, message: '请选择' }]"
              :label="index + 1 + '. ' + item.title +  '【' + appStore.dict?.question_type.find((v: any) => v.itemValue === item.type).itemText + '】'"
            >
              <a-radio-group v-model:value="formState[item.id].optionId">
                <a-radio v-for="item2 in item.questionOptionList" :key="item2.id" :value="item2.id">
                  <a-row type="flex" :gutter="8">
                    <a-col>{{ item2.name }}</a-col>
                    <a-col flex="auto">
                      <a-form-item class="input_in_option" v-if="item2.inputable">
                        <a-input
                          size="small"
                          v-model:value="formState[item.id].input"
                          style="width: 100%; max-width: 200px"
                          placeholder="请输入"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </div>
          <div v-if="item.type === 'checkbox'">
            <a-form-item
              :name="[item.id, 'optionIds']"
              :rules="[{ required: !!item.required, message: '请选择' }]"
              :label="index + 1 + '. ' + item.title +  '【' + appStore.dict?.question_type.find((v: any) => v.itemValue === item.type).itemText + '】'"
            >
              <a-checkbox-group v-model:value="formState[item.id].optionIds">
                <a-checkbox v-for="(item2, index2) in item.questionOptionList" :key="item2.id" :value="item2.id">
                  <a-row type="flex" :gutter="8">
                    <a-col>
                      {{ item2.name }}
                    </a-col>
                    <a-col flex="auto">
                      <a-form-item class="input_in_option" v-if="item2.inputable">
                        <a-input
                          size="small"
                          v-model:value="formState[item.id].inputs[index2]"
                          style="width: 100%; max-width: 200px"
                          placeholder="请输入"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </div>
          <div v-if="item.type === 'input'">
            <a-form-item
              :name="[item.id, 'input']"
              :rules="[{ required: !!item.required, message: '请输入' }]"
              :label="index + 1 + '. ' + item.title +  '【' + appStore.dict?.question_type.find((v: any) => v.itemValue === item.type).itemText + '】'"
            >
              <a-input placeholder="请输入" v-model:value="formState[item.id].input" />
            </a-form-item>
          </div>
          <div v-if="item.type === 'textarea'">
            <a-form-item
              :name="[item.id, 'input']"
              :rules="[{ required: !!item.required, message: '请输入' }]"
              :label="index + 1 + '. ' + item.title +  '【' + appStore.dict?.question_type.find((v: any) => v.itemValue === item.type).itemText + '】'"
            >
              <a-textarea placeholder="请输入" v-model:value="formState[item.id].input" />
            </a-form-item>
          </div>
        </template>
        <a-button type="primary" @click="handleSubmit" :disabled="!!state.tip"> 提交 </a-button>
      </a-form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import mainService from "@/services/main";
import { useAppStore } from "@/stores/app";
import { useRoute } from "vue-router";
import _ from "lodash-es";
import UAParser from "ua-parser-js";
import dayjs from "dayjs";

const appStore = useAppStore();
const route = useRoute();
const questionnaireId = route.params.questionnaireId;
const parser = new UAParser();
const channel = parser.getDevice().type === "mobile" ? "mobile" : "pc";
const state = reactive({
  loadding: true,
  confirmLoading: false,
  questionnaire: {} as any,
  tip: "",
  complete: false,
});
const formState = reactive({} as any);
const formRef = ref();

// 拉取问卷
const fetchQuestionnaireDetail = async () => {
  state.loadding = true;
  const res = await mainService.questionnaireQuestionnaireDetail({
    data: {
      id: questionnaireId,
    },
  });

  if (res.data?.code === 200) {
    state.questionnaire = res.data.data;

    // 根据问卷题目初始化答卷表单
    state.questionnaire.questionList.forEach((v: any) => {
      formState[v.id] = {
        type: v.type,
        questionId: v.id,
      };
      if (v.type === "checkbox") {
        formState[v.id].optionIds = [];
        formState[v.id].inputs = [];
      }
    });

    // tip
    if (state.questionnaire.state !== "published") {
      state.tip =
        "问卷" +
        appStore.dict?.questionnaire_state.find((v: any) => v.itemValue === state.questionnaire.state).itemText;
    } else if (
      state.questionnaire.collectionLimit &&
      state.questionnaire.collectionLimit <= state.questionnaire.answerSheetCount
    ) {
      state.tip = "问卷已达到最大回收数量";
    } else if (dayjs(state.questionnaire.now).isBefore(state.questionnaire.startTime)) {
      state.tip = "问卷未开始";
    } else if (dayjs(state.questionnaire.now).isAfter(state.questionnaire.endTime)) {
      state.tip = "问卷已结束";
    }
  }

  state.loadding = false;
};

// 提交
const handleSubmit = async () => {
  const res = await formRef.value.validateFields();

  if (!res.errorFields) {
    const data = {
      questionnaireId,
      channel,
      answerList: [] as any,
    };

    _.forEach(formState, (v) => {
      if (v.type === "checkbox") {
        v.optionIds.forEach((vv: string, ii: number) => {
          const answer = {
            type: v.type,
            questionId: v.questionId,
            input: v.inputs[ii],
            optionId: vv,
          };
          data.answerList.push(answer);
        });
      } else {
        const answer = {
          type: v.type,
          questionId: v.questionId,
          input: v.input,
          optionId: v.optionId,
        };
        data.answerList.push(answer);
      }
    });

    const res2 = await mainService.questionnaireSurveySave({
      data,
    });

    if (res2.data?.code === 200) {
      state.complete = true;
    }
  }
};

onMounted(async () => {
  await fetchQuestionnaireDetail();
});
</script>

<style scoped lang="less">
.survey_page {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  .complete {
    padding-top: 100px;
    font-size: 20px;
    text-align: center;
  }
  .loading {
    padding-top: 200px;
  }
  .tip {
    color: #ff4d4f;
    margin-bottom: 20px;
    text-align: center;
  }
  .description {
    color: #999;
    margin: 20px 0 30px;
  }
  .form {
    width: 100%;
    padding: 16px;
    .input_in_option {
      margin-bottom: 0;
      :deep(.ant-form-item-control-input) {
        align-items: baseline;
        min-height: auto;
      }
    }
    :deep(.ant-radio-group) {
      width: 100%;
      .ant-radio-wrapper {
        display: flex;
        min-height: 32px;
        margin-right: 0;
        span.ant-radio + * {
          padding-right: 0;
          width: 100%;
        }
      }
    }
    :deep(.ant-checkbox-group) {
      width: 100%;
      .ant-checkbox-wrapper {
        display: flex;
        min-height: 32px;
        margin-right: 0;
        span.ant-checkbox + * {
          padding-right: 0;
          width: 100%;
        }
        + .ant-checkbox-wrapper {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
