<template>
  <a-drawer
    :body-style="{ padding: '16px' }"
    :width="720"
    title="角色配置"
    placement="right"
    v-model:visible="state.visible"
    :destroyOnClose="true"
    @close="handleClose"
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
    <a-space class="my-table-top-buttons">
      <a-button @click="handleAdd()" type="primary">新增</a-button>
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
      row-key="userRoleId"
      size="small"
      bordered
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'num'">
          {{ index + 1 }}
        </template>
        <template v-if="column.key === 'action'">
          <a-popconfirm title="确认删除吗？" placement="topRight" @confirm="handleDelete([record.userRoleId])">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
    <role-select-modal ref="roleSelectModalRef" :onSubmit="handleAddSubmit"></role-select-modal>
  </a-drawer>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from "vue";
import { message, Modal } from "ant-design-vue";
import { DownOutlined } from "@ant-design/icons-vue";
import usePage from "@/hooks/usePage";
import RoleSelectModal from "@/components/biz/RoleSelectModal.vue";
import mainService from "@/services/main";

const roleSelectModalRef = ref();
const state = reactive({
  userId: "",
  visible: false,
});
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
    {
      title: "操作",
      width: 140,
      dataIndex: "action",
      key: "action",
      fixed: "right",
    },
  ],
  pageServiceCall: async (payload) => {
    const res = await mainService.sysRolePageByUser({
      data: {
        ...payload,
        userId: state.userId,
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

// 新增
const handleAdd = async () => {
  roleSelectModalRef.value.open();
};

// 新增确定
const handleAddSubmit = async (selectedRowKeys: string[]) => {
  const res = await mainService.sysUserRoleSaveBatch({
    data: selectedRowKeys.map((v) => ({
      userId: state.userId,
      roleId: v,
    })),
  });

  if (res.data?.code === 200) {
    fetchTableData();
    return Promise.resolve(true);
  } else {
    return Promise.resolve(false);
  }
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
  const res = await mainService.sysUserRoleRemoveByIds({
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

// 关闭抽屉
const handleClose = async () => {
  state.visible = false;
  resetState();
};

// 打开抽屉
const open = async (record: Record<string, any>) => {
  state.userId = record.id;
  state.visible = true;

  fetchTableData();
};

// 需要暴露出去的属性
defineExpose({
  open,
});
</script>

<style scoped></style>
