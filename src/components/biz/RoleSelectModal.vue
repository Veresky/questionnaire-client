<template>
  <a-modal
    centered
    title="角色选择"
    :width="720"
    :confirmLoading="state.confirmLoading"
    :destroyOnClose="true"
    v-model:visible="state.visible"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form class="my-search-from" ref="searchFormRef" :model="searchFormState">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item name="roleName" label="角色名称">
            <a-input v-model:value="searchFormState.roleName" placeholder="请输入"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item name="roleCode" label="角色编码">
            <a-input v-model:value="searchFormState.roleCode" placeholder="请输入"></a-input>
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
      <template #bodyCell="{ column, index }">
        <template v-if="column.key === 'num'">
          {{ index + 1 }}
        </template>
      </template>
    </a-table>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import usePage from "@/hooks/usePage";
import _ from "lodash-es";
import mainService from "@/services/main";

const {
  searchFormRef,
  searchFormState,
  tableProps,
  rowSelectionProps,
  fetchTableData,
  searchFormSubmit,
  searchFormReset,
  resetState,
  tableEvents,
  rowSelectionEvents,
} = usePage({
  initSearchFormState: () => ({
    roleName: "",
    roleCode: "",
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
      title: "角色名称",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "角色编码",
      dataIndex: "roleCode",
      key: "roleCode",
    },
  ],
  pageServiceCall: async (payload) => {
    const res = await mainService.sysRolePage({
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
const state = reactive({
  visible: false,
  confirmLoading: false,
});
const props = defineProps<{
  onSubmit: (selectedRowKeys: string[]) => Promise<boolean>;
}>();

// 确定
const handleOk = async () => {
  state.confirmLoading = true;
  const res = await props.onSubmit(rowSelectionProps.selectedRowKeys);
  state.confirmLoading = false;

  if (res) {
    handleCancel();
  }
};

// 取消
const handleCancel = async () => {
  state.visible = false;
  resetState();
};

// 打开弹框
const open = async () => {
  state.visible = true;
  fetchTableData();
};

// 需要暴露出去的属性
defineExpose({
  open,
});
</script>

<style scoped></style>
