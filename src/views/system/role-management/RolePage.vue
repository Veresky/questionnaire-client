<template>
  <a-card :body-style="{ padding: '16px' }">
    <a-form class="my-search-from" ref="searchFormRef" :model="searchFormState">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item name="roleName" label="角色名称">
            <a-input v-model:value="searchFormState.roleName" placeholder="请输入"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="roleCode" label="角色编码">
            <a-input v-model:value="searchFormState.roleCode" placeholder="请输入"></a-input>
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
          <a @click="handleRoleModuleConfigure(record)">模块授权</a>
          <a-divider type="vertical" />
          <a @click="handleRolePermissionConfigure(record)">接口授权</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除吗？" placement="topRight" @confirm="handleDelete(record)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </a-card>
  <role-edit-modal ref="roleEditModalRef" :onSuccess="fetchTableData" />
  <role-module-configure-drawer ref="roleModuleConfigureDrawerRef" />
  <role-permission-configure-drawer ref="rolePermissionConfigureDrawerRef" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import usePage from "@/hooks/usePage";
import mainService from "@/services/main";
import RoleEditModal from "./RoleEditModal.vue";
import RoleModuleConfigureDrawer from "./RoleModuleConfigureDrawer.vue";
import RolePermissionConfigureDrawer from "./RolePermissionConfigureDrawer.vue";

const roleEditModalRef = ref();
const roleModuleConfigureDrawerRef = ref();
const rolePermissionConfigureDrawerRef = ref();
const { searchFormRef, searchFormState, tableProps, fetchTableData, searchFormSubmit, searchFormReset, tableEvents } =
  usePage({
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
        width: 240,
        dataIndex: "action",
        key: "action",
        fixed: "right",
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

// 编辑
const handleEdit = async (record?: Record<string, any>) => {
  roleEditModalRef.value.open(record);
};

// 角色模块配置
const handleRoleModuleConfigure = (record: Record<string, any>) => {
  roleModuleConfigureDrawerRef.value.open(record);
};

// 角色接口配置
const handleRolePermissionConfigure = (record: Record<string, any>) => {
  rolePermissionConfigureDrawerRef.value.open(record);
};

// 删除
const handleDelete = async (record: Record<string, any>) => {
  const res = await mainService.sysRoleDelete({
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
