<template>
  <a-card :body-style="{ padding: '16px' }">
    <a-table
      :columns="tableProps.columns"
      :data-source="tableProps.dataSource"
      :loading="tableProps.loading"
      row-key="id"
      size="small"
      bordered
    >
      <template #bodyCell="{ column, record, text, index }">
        <template v-if="column.key === 'num'">
          {{ index + 1 }}
        </template>
        <template v-if="column.key === 'username'">
          {{ text }}
          &nbsp;
          <a-tag v-if="record.isCurrentUser" color="red">当前用户</a-tag>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import mainService from "@/services/main";

const tableProps = reactive({
  columns: [
    {
      width: 50,
      title: "序号",
      dataIndex: "num",
      key: "num",
      fixed: "left",
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "登录时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
    },
  ],
  dataSource: [],
  loading: false,
});

const fetchTableData = async () => {
  tableProps.loading = true;
  const res = await mainService.monitorOnlineList();
  tableProps.loading = false;

  if (res.data?.code === 200) {
    tableProps.dataSource = res.data.data;
  }
};

onMounted(async () => {
  fetchTableData();
});
</script>

<style scoped lang="less"></style>
