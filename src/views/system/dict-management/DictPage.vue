<template>
  <a-card :body-style="{ padding: '16px' }">
    <a-form class="my-search-from" ref="searchFormRef" :model="searchFormState">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item name="dictName" label="字典名称">
            <a-input v-model:value="searchFormState.dictName" placeholder="请输入"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="dictCode" label="字典编码">
            <a-input v-model:value="searchFormState.dictCode" placeholder="请输入"></a-input>
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
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'num'">
          {{ index + 1 }}
        </template>
        <template v-if="column.key === 'action'">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="handleConfigure(record)">配置</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除吗？" placement="topRight" @confirm="handleDelete(record)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </a-card>
  <dict-edit-modal ref="dictEditModalRef" :onSuccess="fetchTableData" />
  <dict-item-configure-drawer ref="dictItemConfigureDrawerRef" />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import usePage from "@/hooks/usePage";
import mainService from "@/services/main";
import DictEditModal from "./DictEditModal.vue";
import DictItemConfigureDrawer from "./DictItemConfigureDrawer.vue";

const dictEditModalRef = ref();
const dictItemConfigureDrawerRef = ref();
const { searchFormRef, searchFormState, tableProps, fetchTableData, searchFormSubmit, searchFormReset, tableEvents } =
  usePage({
    initSearchFormState: () => ({
      dictName: "",
      dictCode: "",
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
        title: "字典名称",
        dataIndex: "dictName",
        key: "dictName",
      },
      {
        title: "字典编码",
        dataIndex: "dictCode",
        key: "dictCode",
      },
      {
        title: "描述",
        dataIndex: "description",
        key: "description",
      },
      {
        title: "操作",
        width: 140,
        dataIndex: "action",
        key: "action",
        fixed: "right",
      },
    ],
    pageServiceCall: async (payload) => {
      const res = await mainService.sysDictPage({
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

// 编辑
const handleEdit = async (record?: Record<string, any>) => {
  dictEditModalRef.value.open(record);
};

// 配置
const handleConfigure = (record: Record<string, any>) => {
  dictItemConfigureDrawerRef.value.open(record);
};

// 删除
const handleDelete = async (record: Record<string, any>) => {
  const res = await mainService.sysDictDelete({
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
