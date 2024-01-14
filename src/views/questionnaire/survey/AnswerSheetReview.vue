<template>
  <div class="answer_sheet_review_page">
    <a-spin v-if="state.loadding" class="loading" size="large"></a-spin>
    <template v-else>
      <a-form class="form" layout="vertical">
        <a-divider>{{ state.questionnaire.title }}</a-divider>
        <div class="description">{{ state.questionnaire.description }}</div>
        <template v-for="(item, index) in state.questionnaire.questionList" :key="item.id">
          <div v-if="item.type === 'radio'">
            <a-form-item
              :label="index + 1 + '. ' + item.title +  '【' + appStore.dict?.question_type.find((v: any) => v.itemValue === item.type).itemText + '】'"
            >
              <a-radio-group v-model:value="formState[item.id].optionId">
                <a-radio disabled v-for="item2 in item.questionOptionList" :key="item2.id" :value="item2.id">
                  <a-row type="flex" :gutter="8">
                    <a-col>{{ item2.name }}</a-col>
                    <a-col flex="auto">
                      <a-form-item class="input_in_option" v-if="item2.inputable">
                        <a-input
                          disabled
                          size="small"
                          v-model:value="formState[item.id].input"
                          style="width: 100%; max-width: 200px"
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
              :label="index + 1 + '. ' + item.title +  '【' + appStore.dict?.question_type.find((v: any) => v.itemValue === item.type).itemText + '】'"
            >
              <a-checkbox-group v-model:value="formState[item.id].optionIds">
                <a-checkbox
                  disabled
                  v-for="(item2, index2) in item.questionOptionList"
                  :key="item2.id"
                  :value="item2.id"
                >
                  <a-row type="flex" :gutter="8">
                    <a-col>
                      {{ item2.name }}
                    </a-col>
                    <a-col flex="auto">
                      <a-form-item class="input_in_option" v-if="item2.inputable">
                        <a-input
                          disabled
                          size="small"
                          v-model:value="formState[item.id].inputs[index2]"
                          style="width: 100%; max-width: 200px"
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
              :label="index + 1 + '. ' + item.title +  '【' + appStore.dict?.question_type.find((v: any) => v.itemValue === item.type).itemText + '】'"
            >
              <a-input disabled v-model:value="formState[item.id].input" />
            </a-form-item>
          </div>
          <div v-if="item.type === 'textarea'">
            <a-form-item
              :label="index + 1 + '. ' + item.title +  '【' + appStore.dict?.question_type.find((v: any) => v.itemValue === item.type).itemText + '】'"
            >
              <a-textarea disabled v-model:value="formState[item.id].input" />
            </a-form-item>
          </div>
        </template>
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

const appStore = useAppStore();
const route = useRoute();
const answerSheetId = route.params.answerSheetId;
const state = reactive({
  loadding: true,
  questionnaire: {} as any,
  answerSheet: {} as any,
});
const formState = reactive({} as any);

// 拉取答卷
const fetchAnswerSheetDetail = async () => {
  state.loadding = true;
  const res = await mainService.questionnaireAnswerSheetDetail({
    data: {
      id: answerSheetId,
    },
  });

  if (res.data?.code === 200) {
    state.answerSheet = res.data.data;
  }
};

// 拉取问卷
const fetchQuestionnaireDetail = async () => {
  const res = await mainService.questionnaireQuestionnaireDetail({
    data: {
      id: state.answerSheet.questionnaireId,
    },
  });

  if (res.data?.code === 200) {
    state.questionnaire = res.data.data;

    // 根据问卷题目初始化答卷表单和表单已填项
    const answers = {} as any;
    state.answerSheet.answerList.forEach((v: any) => {
      if (answers[v.questionId]) {
        if (!answers[v.questionId].optionIds) {
          answers[v.questionId].optionIds = [answers[v.questionId].optionId];
          answers[v.questionId].inputs = [answers[v.questionId].input];
        }

        answers[v.questionId].optionIds.push(v.optionId);
        answers[v.questionId].inputs[answers[v.questionId].optionIds.length - 1] = v.input;
      } else {
        answers[v.questionId] = {
          optionId: v.optionId,
          input: v.input,
        };
      }
    });

    state.questionnaire.questionList.forEach((v: any) => {
      formState[v.id] = {
        type: v.type,
        questionId: v.id,
      };

      if (v.type === "checkbox") {
        if (answers[v.id]) {
          formState[v.id].optionIds = answers[v.id].optionIds || [answers[v.id].optionId];
          formState[v.id].inputs = answers[v.id].inputs || [answers[v.id].input];
        } else {
          formState[v.id].optionIds = [];
          formState[v.id].inputs = [];
        }
      } else {
        formState[v.id].optionId = answers[v.id].optionId;
        formState[v.id].input = answers[v.id].input;
      }
    });
  }

  state.loadding = false;
};

onMounted(async () => {
  await fetchAnswerSheetDetail();
  await fetchQuestionnaireDetail();
});
</script>

<style scoped lang="less">
.answer_sheet_review_page {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  .loading {
    padding-top: 200px;
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
