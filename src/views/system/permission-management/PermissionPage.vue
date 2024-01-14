<template>
  <a-card :body-style="{ padding: '16px' }">
    <a-form class="my-search-from" ref="searchFormRef" :model="searchFormState">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item name="name" label="接口名称">
            <a-input v-model:value="searchFormState.name" placeholder="请输入"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="path" label="接口地址">
            <a-input v-model:value="searchFormState.path" placeholder="请输入"></a-input>
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
      <a-dropdown v-if="rowSelectionProps.selectedRowKeys.length">
        <template #overlay>
          <a-menu>
            <a-menu-item @click="handleDeleteBatch(rowSelectionProps.selectedRowKeys)">删除</a-menu-item>
          </a-menu>
        </template>
        <a-button>
          批量操作
          <DownOutlined />
        </a-button>
      </a-dropdown>
    </a-space>
    <a-table
      :row-selection="{
        selectedRowKeys: rowSelectionProps.selectedRowKeys,
        onChange: rowSelectionEvents.onChange,
        preserveSelectedRowKeys: true,
      }"
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
          <a-popconfirm title="确认删除吗？" placement="topRight" @confirm="handleDelete([record.id])">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </a-card>
  <permission-edit-modal ref="permissionEditModalRef" :onSuccess="fetchTableData" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message, Modal } from "ant-design-vue";
import { DownOutlined } from "@ant-design/icons-vue";
import usePage from "@/hooks/usePage";
import mainService from "@/services/main";
import PermissionEditModal from "./PermissionEditModal.vue";

const permissionEditModalRef = ref();
const {
  searchFormRef,
  searchFormState,
  tableProps,
  rowSelectionProps,
  fetchTableData,
  searchFormSubmit,
  searchFormReset,
  tableEvents,
  rowSelectionEvents,
} = usePage({
  initSearchFormState: () => ({
    name: "",
    path: "",
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
      title: "接口名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "接口地址",
      dataIndex: "path",
      key: "path",
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
    const res = await mainService.sysPermissionPage({
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
  permissionEditModalRef.value.open(record);
};

// 批量删除
const handleDeleteBatch = async (ids: string[]) => {
  Modal.confirm({
    title: "确认删除",
    content: `是否删除选中的 ${ids.length} 条数据`,
    onOk: async () => handleDelete(ids, true),
    onCancel() {},
  });
};

// 删除
const handleDelete = async (ids: string[], isBatch?: boolean) => {
  const res = await mainService.sysPermissionRemoveByIds({
    data: ids,
  });

  if (res.data?.code === 200) {
    message.success(res.data.msg);
    if (isBatch) {
      // 批量删除清除复选内框
      rowSelectionProps.selectedRowKeys = [];
    }
    fetchTableData();

    return Promise.resolve();
  }
};

onMounted(async () => {
  fetchTableData();
});
</script>

<style scoped lang="less"></style>
