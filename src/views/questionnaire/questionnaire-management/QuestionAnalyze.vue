<template>
  <div>
    答卷数量：<strong>{{ props.counts.count }}</strong>
  </div>
  <template v-for="item in state.data" :key="item.id">
    <a-table
      v-if="item.type == 'radio' || item.type == 'checkbox'"
      :columns="columns"
      :data-source="item.questionOptionList"
      :pagination="false"
      class="table"
      row-key="id"
      size="small"
      bordered
    >
      <template #title>
        {{
          item.title + "【" + appStore.dict?.question_type.find((v: any) => v.itemValue === item.type).itemText + "】"
        }}
        <a-tag color="red" v-if="item.required">必填</a-tag>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'percent'">
          {{ ((record.count / item.optionsCount) * 100 || 0).toFixed(2) + "%" }}
        </template>
      </template>
    </a-table>
  </template>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import mainService from "@/services/main";
import { useAppStore } from "@/stores/app";

const columns = [
  {
    title: "选项",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "答卷数量",
    dataIndex: "count",
    key: "count",
    width: 100,
  },
  {
    title: "占比",
    dataIndex: "percent",
    key: "percent",
    width: 100,
  },
];
const appStore = useAppStore();
const props = defineProps<{
  questionnaireId: string;
  counts: any;
}>();
const state = reactive({
  questionnaireId: "",
  loadding: false,
  data: [] as any[],
});

const fetchData = async () => {
  const p0 = mainService.questionnaireQuestionListWithQuestionOption({
    data: {
      questionnaireId: props.questionnaireId,
    },
  });
  const p1 = mainService.questionnaireAnswerCountGroupByQuestionOption({
    data: {
      questionnaireId: props.questionnaireId,
    },
  });

  state.loadding = true;
  const res = await Promise.all([p0, p1]);
  state.loadding = false;

  if (res[0].data?.code === 200 && res[1].data?.code === 200) {
    const ret = {} as any;
    res[1].data?.data.forEach((v: any) => {
      ret[v.optionId] = v.count;
    });

    res[0].data.data.forEach((v: any) => {
      let optionsCount = 0;
      v.questionOptionList.forEach((vv: any) => {
        vv.count = ret[vv.id] || 0;
        optionsCount = optionsCount + vv.count;
      });
      v.optionsCount = optionsCount;
    });

    state.data = res[0].data?.data;
  }
};

onMounted(async () => {
  fetchData();
});
</script>

<style scoped lang="less">
.table {
  margin-top: 16px;
}
</style>
