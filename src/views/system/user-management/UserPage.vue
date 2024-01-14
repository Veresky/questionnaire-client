<template>
  <a-card :body-style="{ padding: '16px' }">
    <a-form class="my-search-from" ref="searchFormRef" :model="searchFormState">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item name="username" label="账号">
            <a-input v-model:value="searchFormState.username" placeholder="请输入"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="realname" label="名称">
            <a-input v-model:value="searchFormState.realname" placeholder="请输入"></a-input>
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
        <template v-if="column.key === 'state'">
          <a-tag v-if="text === 'enable'" color="#87d068">
            {{ appStore.dict!.user_state.find((v: any) => v.itemValue === text).itemText }}
          </a-tag>
          <a-tag v-else color="pink">
            {{ appStore.dict!.user_state.find((v: any) => v.itemValue === text).itemText }}
          </a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-popconfirm title="确定重置密码？" @confirm="handleResetPwd(record)">
            <a>重置密码</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="handleUserRoleConfigure(record)">角色</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除吗？" placement="topRight" @confirm="handleDelete(record)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </a-card>
  <user-edit-modal ref="userEditModalRef" :onSuccess="fetchTableData" />
  <user-role-configure-drawer ref="userRoleConfigureDrawerRef" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message, Modal } from "ant-design-vue";
import usePage from "@/hooks/usePage";
import mainService from "@/services/main";
import UserEditModal from "./UserEditModal.vue";
import UserRoleConfigureDrawer from "./UserRoleConfigureDrawer.vue";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const userEditModalRef = ref();
const userRoleConfigureDrawerRef = ref();
const { searchFormRef, searchFormState, tableProps, fetchTableData, searchFormSubmit, searchFormReset, tableEvents } =
  usePage({
    initSearchFormState: () => ({
      username: "",
      realname: "",
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
        title: "账号",
        dataIndex: "username",
        key: "username",
      },
      {
        title: "名称",
        dataIndex: "realname",
        key: "realname",
      },
      {
        title: "状态",
        dataIndex: "state",
        key: "state",
      },
      {
        title: "操作",
        width: 220,
        dataIndex: "action",
        key: "action",
        fixed: "right",
      },
    ],
    pageServiceCall: async (payload) => {
      const res = await mainService.sysUserPage({
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

// 重置密码
const handleResetPwd = async (record?: Record<string, unknown>) => {
  const res = await mainService.sysUserResetPassword({
    data: {
      id: record?.id,
    },
  });

  if (res.data?.code === 200) {
    Modal.success({
      title: "重置密码成功",
      content: "新密码：" + res.data.data,
    });
  }
};

// 编辑
const handleEdit = async (record?: Record<string, unknown>) => {
  userEditModalRef.value.open(record);
};

// 用户角色配置
const handleUserRoleConfigure = (record: Record<string, any>) => {
  userRoleConfigureDrawerRef.value.open(record);
};

// 删除
const handleDelete = async (record: Record<string, any>) => {
  const res = await mainService.sysUserDelete({
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
