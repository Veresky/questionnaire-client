<template>
  <a-card :body-style="{ padding: '16px' }">
    <a-form class="my-search-from" ref="searchFormRef" :model="searchFormState">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item name="createBy" label="用户名">
            <a-input v-model:value="searchFormState.createBy" placeholder="请输入"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="code" label="响应码">
            <a-input v-model:value="searchFormState.code" placeholder="请输入"></a-input>
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
        <template v-if="column.key === 'code'">
          <a-tag v-if="text === 200" color="green">
            {{ text }}
          </a-tag>
          <a-tag v-if="record.code >= 500" color="red">
            {{ text }}
          </a-tag>
          <a-tag v-if="record.code >= 400 && record.code < 500" color="orange">
            {{ text }}
          </a-tag>
        </template>
        <template v-if="column.key === 'duration'">{{ text }} ms</template>
      </template>
    </a-table>
  </a-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import usePage from "@/hooks/usePage";
import mainService from "@/services/main";

const { searchFormRef, searchFormState, tableProps, fetchTableData, searchFormSubmit, searchFormReset, tableEvents } =
  usePage({
    initSearchFormState: () => ({
      createBy: "",
      code: "",
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
        title: "用户名",
        dataIndex: "createBy",
        key: "createBy",
      },
      {
        title: "路径",
        dataIndex: "path",
        key: "path",
      },
      {
        title: "方法",
        dataIndex: "method",
        key: "method",
      },
      {
        title: "响应码",
        dataIndex: "code",
        key: "code",
      },
      {
        title: "开始时间",
        dataIndex: "startTime",
        key: "startTime",
      },
      {
        title: "耗时",
        dataIndex: "duration",
        key: "duration",
      },
      {
        title: "IP",
        dataIndex: "ip",
        key: "ip",
      },
    ],
    pageServiceCall: async (payload) => {
      const res = await mainService.monitorLogPage({
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

onMounted(async () => {
  fetchTableData();
});
</script>

<style scoped lang="less"></style>
