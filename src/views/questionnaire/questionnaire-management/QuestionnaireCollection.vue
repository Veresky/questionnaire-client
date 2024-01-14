<template>
  <div class="top_box">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-card title="进度统计" :bordered="false" size="small">
          <div id="bar"></div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="渠道统计" :bordered="false" size="small">
          <div id="pie"></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
  <a-form class="my-search-from" ref="searchFormRef" :model="searchFormState">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-form-item name="channel" label="渠道">
          <a-select v-model:value="searchFormState.channel">
            <a-select-option v-for="item in appStore.dict!.answer_channel" :key="item.id" :value="item.itemValue">
              {{ item.itemText }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item name="rangeTime" label="提交时间">
          <a-range-picker v-model:value="searchFormState.rangeTime" />
        </a-form-item>
      </a-col>
      <a-col :span="8" style="text-align: right">
        <a-space>
          <a-button type="primary" html-type="submit" @click="searchFormSubmit">搜索</a-button>
          <a-button @click="searchFormReset">重置</a-button>
        </a-space>
      </a-col>
    </a-row>
  </a-form>
  <a-table
    :columns="tableProps.columns"
    :data-source="tableProps.dataSource"
    :pagination="tableProps.pagination"
    :loading="tableProps.loading"
    @change="tableEvents.change"
    @resizeColumn="tableEvents.resizeColumn"
    class="my-table"
    row-key="id"
    size="small"
    bordered
  >
    <template #bodyCell="{ column, text, record, index }">
      <template v-if="column.key === 'num'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'channel'">
        {{ appStore.dict?.answer_channel.find((v: any) => v.itemValue === text).itemText }}
      </template>
      <template v-if="column.key === 'action'">
        <router-link :to="`/questionnaire/answerSheetReview/${record.id}`" target="_blank">查看</router-link>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from "vue";
import usePage from "@/hooks/usePage";
import mainService from "@/services/main";
import { useAppStore } from "@/stores/app";
import { DATE_FORMAT_2 } from "@/utils/constant";
import { Pie, Bar } from "@antv/g2plot";

const appStore = useAppStore();
const props = defineProps<{
  questionnaireId: string;
  collectionLimit: null | undefined | number;
  counts: any;
}>();
const state = reactive({
  visible: false,
});
const { searchFormRef, searchFormState, tableProps, fetchTableData, searchFormSubmit, searchFormReset, tableEvents } =
  usePage({
    initSearchFormState: () => ({
      channel: "",
      rangeTime: null,
    }),
    initColumns: () => [
      {
        width: 50,
        title: "序号",
        dataIndex: "num",
        key: "num",
        fixed: "left",
      },
      {
        title: "渠道",
        dataIndex: "channel",
        key: "channel",
      },
      {
        title: "提交时间",
        dataIndex: "createTime",
        key: "createTime",
      },
      {
        title: "IP",
        dataIndex: "ip",
        key: "ip",
      },
      {
        title: "操作",
        width: 80,
        dataIndex: "action",
        key: "action",
        fixed: "right",
      },
    ],
    pageServiceCall: async (payload) => {
      if (payload.rangeTime) {
        payload.startTime = payload.rangeTime[0].format(DATE_FORMAT_2 + " 00:00:00");
        payload.endTime = payload.rangeTime[1].format(DATE_FORMAT_2 + " 23:59:59");
        delete payload.rangeTime;
      }

      const res = await mainService.questionnaireAnswerSheetPage({
        data: {
          ...payload,
          questionnaireId: props.questionnaireId,
        },
      });

      if (res.data?.code === 200) {
        const data = res.data.data;

        return {
          dataSource: data.records,
          pagination: {
            total: data.total,
            current: data.current,
            pageSize: data.size,
          },
        };
      }
    },
  });
let pie: Pie;
let bar: Bar;

const initPie = () => {
  pie = new Pie("pie", {
    appendPadding: 16,
    data: props.counts.channelCountList,
    height: 150,
    angleField: "count",
    colorField: "channelText",
    legend: false,
    label: {
      type: "spider",
      content: "{name} {percentage}",
    },
    interactions: [{ type: "element-active" }],
  });

  pie.render();
};

const initBar = () => {
  bar = new Bar("bar", {
    appendPadding: 16,
    data: [
      {
        label: "已回收数量",
        value: props.counts.count,
      },
      {
        label: "回收限制",
        value: props.collectionLimit,
      },
    ],
    height: 150,
    xField: "value",
    yField: "label",
    seriesField: "label",
    legend: false,
    label: {
      position: "right",
      offset: 4,
    },
  });

  bar.render();
};

onMounted(async () => {
  await fetchTableData();

  initPie();
  initBar();
});

onUnmounted(() => {
  if (pie) {
    pie.destroy();
  }
  if (pie) {
    bar.destroy();
  }
});
</script>

<style scoped lang="less">
.top_box {
  background-color: #ececec;
  padding: 16px;
  margin-bottom: 24px;
}
</style>
