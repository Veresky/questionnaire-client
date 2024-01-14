<template>
  <a-card :body-style="{ padding: '16px' }">
    <a-space class="my-table-top-buttons">
      <a-button @click="handleAdd()" type="primary">新增</a-button>
    </a-space>
    <a-table
      :columns="tableProps.columns"
      :data-source="tableProps.dataSource"
      :loading="tableProps.loading"
      :pagination="false"
      row-key="id"
      size="small"
      bordered
    >
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'moduleType'">
          {{ appStore.dict!.module_type.find((v: any) => v.itemValue === text).itemText }}
        </template>
        <template v-if="column.key === 'action'">
          <a @click="handleUpdate(record)">修改</a>
          <a-divider type="vertical" />
          <template v-if="record.moduleType === 'menu'">
            <a @click="handleAdd(record)">新增子模块</a>
            <a-divider type="vertical" />
          </template>
          <a-popconfirm title="确认删除吗？" placement="topRight" @confirm="handleDelete(record)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </a-card>
  <module-edit-modal ref="moduleEditModalRef" :parentTreeData="tableProps.dataSource" :onSuccess="fetchTableData" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import mainService from "@/services/main";
import ModuleEditModal from "./ModuleEditModal.vue";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const moduleEditModalRef = ref();
const tableProps = reactive({
  columns: [
    {
      title: "模块名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "模块类型",
      dataIndex: "moduleType",
      key: "moduleType",
    },
    {
      title: "图标",
      dataIndex: "icon",
      key: "icon",
    },
    {
      title: "路径",
      dataIndex: "path",
      key: "path",
    },
    {
      title: "排序",
      dataIndex: "sortNo",
      key: "sortNo",
    },
    {
      title: "操作",
      width: 180,
      dataIndex: "action",
      key: "action",
      fixed: "right",
    },
  ],
  dataSource: [],
  loading: false,
});

const fetchTableData = async () => {
  tableProps.loading = true;
  const res = await mainService.sysModuleTree();
  tableProps.loading = false;

  if (res.data?.code === 200) {
    tableProps.dataSource = res.data.data;
  }
};

// 新增
const handleAdd = (record?: Record<string, any>) => {
  moduleEditModalRef.value.open(
    record
      ? {
          parentId: record.id,
          parentIdPath: record.idPath,
        }
      : null
  );
};

// 编辑
const handleUpdate = async (record: Record<string, any>) => {
  const idPathArr = record.idPath.split(",");
  const parentIdPathArr = idPathArr.slice(0, idPathArr.length - 1);

  moduleEditModalRef.value.open({
    ...record,
    parentIdPath: parentIdPathArr.join(","),
  });
};

// 删除
const handleDelete = async (record: Record<string, any>) => {
  const res = await mainService.sysModuleDelete({
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
