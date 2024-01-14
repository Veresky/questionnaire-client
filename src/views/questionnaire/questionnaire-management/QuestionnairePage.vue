<template>
  <a-card :body-style="{ padding: '16px' }">
    <a-form class="my-search-from" ref="searchFormRef" :model="searchFormState">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item name="title" label="标题">
            <a-input v-model:value="searchFormState.title" placeholder="请输入"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="state" label="状态">
            <a-select v-model:value="searchFormState.state">
              <a-select-option
                v-for="item in appStore.dict!.questionnaire_state"
                :key="item.id"
                :value="item.itemValue"
              >
                {{ item.itemText }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12" style="text-align: right">
          <a-space>
            <a-button type="primary" html-type="submit" @click="searchFormSubmit">搜索</a-button>
            <a-button @click="searchFormReset">重置</a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form>
    <a-space class="my-table-top-buttons">
      <a-button @click="handleEdit()" type="primary">新增</a-button>
    </a-space>
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
      <template #bodyCell="{ column, record, text, index }">
        <template v-if="column.key === 'num'">
          {{ index + 1 }}
        </template>
        <template v-if="(column.key === 'startTime' || column.key === 'endTime') && text == null">无限制</template>
        <template v-if="column.key === 'state'">
          <a-tag v-if="text === 'not_published'" color="#aaa">
            {{ appStore.dict!.questionnaire_state.find((v: any) => v.itemValue === text).itemText }}
          </a-tag>
          <a-tag v-else-if="text === 'paused'" color="#f50">
            {{ appStore.dict!.questionnaire_state.find((v: any) => v.itemValue === text).itemText }}
          </a-tag>
          <a-tag v-else color="#87d068">
            {{ appStore.dict!.questionnaire_state.find((v: any) => v.itemValue === text).itemText }}
          </a-tag>
        </template>
        <template v-if="column.key === 'collectionLimit'">
          {{ text == null ? "无限制" : text + " 份" }}
        </template>
        <template v-if="column.key === 'action'">
          <a @click="handlePublish(record)" v-if="record.state === 'not_published'">发布</a>
          <a @click="handleChangeState(record, 'published', true)" v-else-if="record.state === 'paused'">开启</a>
          <a @click="handleChangeState(record, 'paused', true)" v-else>暂停</a>
          <template v-if="record.state === 'not_published'">
            <a-divider type="vertical" />
            <a @click="handleQuestionnaireQuestionConfigure(record)">题目设计</a>
          </template>
          <a-divider type="vertical" />
          <router-link :to="`/questionnaire/survey/${record.id}`" target="_blank">预览</router-link>
          <template v-if="record.state !== 'not_published'">
            <a-divider type="vertical" />
            <a @click="handleShare(record, '问卷分享')">分享</a>
          </template>
          <template v-if="record.state !== 'not_published'">
            <a-divider type="vertical" />
            <a @click="handleAnalyze(record)">答卷分析</a>
          </template>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">修改</a>
          <template v-if="record.state === 'not_published'">
            <a-divider type="vertical" />
            <a-popconfirm
              v-if="record.state === 'not_published'"
              title="确认删除吗？"
              placement="topRight"
              @confirm="handleDelete(record)"
            >
              <a>删除</a>
            </a-popconfirm>
          </template>
        </template>
      </template>
    </a-table>
  </a-card>
  <questionnaire-edit-modal ref="questionnaireEditModalRef" :onSuccess="fetchTableData" />
  <question-configure-modal ref="questionConfigureModalRef" />
  <questionnaire-share-modal ref="questionnaireShareModalRef" />
  <questionnaire-analyze-modal ref="questionnaireAnalyzeModalRef" />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message, Modal } from "ant-design-vue";
import usePage from "@/hooks/usePage";
import mainService from "@/services/main";
import QuestionnaireEditModal from "./QuestionnaireEditModal.vue";
import QuestionConfigureModal from "./QuestionConfigureModal.vue";
import QuestionnaireShareModal from "./QuestionnaireShareModal.vue";
import QuestionnaireAnalyzeModal from "./QuestionnaireAnalyzeModal.vue";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const questionnaireEditModalRef = ref();
const questionConfigureModalRef = ref();
const questionnaireShareModalRef = ref();
const questionnaireAnalyzeModalRef = ref();
const { searchFormRef, searchFormState, tableProps, fetchTableData, searchFormSubmit, searchFormReset, tableEvents } =
  usePage({
    initSearchFormState: () => ({
      title: "",
      state: "",
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
        title: "标题",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "开始时间",
        dataIndex: "startTime",
        key: "startTime",
      },
      {
        title: "结束时间",
        dataIndex: "endTime",
        key: "endTime",
      },
      {
        title: "状态",
        dataIndex: "state",
        key: "state",
      },
      {
        title: "回收限制",
        dataIndex: "collectionLimit",
        key: "collectionLimit",
      },
      {
        title: "操作",
        width: 260,
        dataIndex: "action",
        key: "action",
        fixed: "right",
      },
    ],
    pageServiceCall: async (payload) => {
      const res = await mainService.questionnaireQuestionnairePage({
        data: payload,
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

// 改变问卷状态
const handleChangeState = async (record: Record<string, any>, state: string, enableTip: boolean) => {
  const res = await mainService.questionnaireQuestionnaireEdit({
    data: {
      ...record,
      state,
    },
  });

  if (res.data?.code === 200) {
    enableTip && message.success(res.data.msg);
    fetchTableData();
  }
};

// 发布问卷
const handlePublish = async (record: Record<string, any>) => {
  Modal.confirm({
    title: "确认发布问卷？",
    content: "问卷发布后，题目不可修改！",
    async onOk() {
      await handleChangeState(record, "published", false);
      handleShare(record, "发布成功（可通过以下方式分享）");
    },
  });
};

// 编辑
const handleEdit = async (record?: Record<string, unknown>) => {
  questionnaireEditModalRef.value.open(record);
};

// 问卷题目配置
const handleQuestionnaireQuestionConfigure = (record: Record<string, any>) => {
  questionConfigureModalRef.value.open(record);
};

// 问卷分析
const handleAnalyze = (record: Record<string, any>) => {
  questionnaireAnalyzeModalRef.value.open(record);
};

// 问卷分享
const handleShare = (record: Record<string, any>, modalTitle: string) => {
  questionnaireShareModalRef.value.open(record, modalTitle);
};

// 删除
const handleDelete = async (record: Record<string, any>) => {
  const res = await mainService.questionnaireQuestionnaireDelete({
    data: {
      id: record.id,
    },
  });

  if (res.data?.code === 200) {
    message.success(res.data.msg);
    fetchTableData();

    return Promise.resolve();
  }
};

onMounted(async () => {
  fetchTableData();
});
</script>

<style scoped lang="less"></style>
