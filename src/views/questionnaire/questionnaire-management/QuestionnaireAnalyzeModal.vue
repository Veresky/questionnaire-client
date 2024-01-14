<template>
  <a-modal style="width: 1000px; top: 20px" :destroyOnClose="true" v-model:visible="state.visible" :footer="null">
    <div class="tabs_box">
      <a-tabs size="large">
        <a-tab-pane key="0" tab="答卷回收">
          <questionnaire-collection
            :questionnaireId="state.questionnaireId"
            :collectionLimit="state.collectionLimit"
            :counts="state.counts"
          />
        </a-tab-pane>
        <a-tab-pane key="1" tab="单题分析">
          <question-analyze :questionnaireId="state.questionnaireId" :counts="state.counts" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import QuestionnaireCollection from "./QuestionnaireCollection.vue";
import QuestionAnalyze from "./QuestionAnalyze.vue";
import mainService from "@/services/main";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const state = reactive({
  visible: false,
  questionnaireId: "",
  collectionLimit: null,
  counts: {},
});

// 打开弹框
const open = async (record: Record<string, any>) => {
  state.visible = true;
  state.questionnaireId = record.id;
  state.collectionLimit = record.collectionLimit;

  const res = await mainService.questionnaireAnswerSheetCountsByQuestionnaireId({
    data: {
      questionnaireId: state.questionnaireId,
    },
  });

  if (res.data?.code === 200) {
    res.data.data.channelCountList.forEach((vv: any) => {
      vv.channelText = appStore.dict?.answer_channel.find((v: any) => v.itemValue === vv.channel).itemText;
    });
    state.counts = res.data.data;
  }
};

// 需要暴露出去的属性
defineExpose({
  open,
});
</script>

<style scoped lang="less">
.tabs_box {
  margin: -24px;
  :deep(.ant-tabs-tab) {
    margin-left: 24px;
  }
  :deep(.ant-tabs-content) {
    padding: 8px 24px 24px;
  }
}
</style>
