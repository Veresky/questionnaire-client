<template>
  <a-drawer
    v-model:visible="state.visible"
    :body-style="{ padding: '16px' }"
    :width="720"
    title="字典项列表"
    placement="right"
    @close="handleClose"
  >
    <a-space class="my-table-top-buttons">
      <a-button @click="handleEdit({ dictId: state.dictId })" type="primary">新增</a-button>
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
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="column.key === 'num'">
          {{ index + 1 }}
        </template>
        <template v-if="column.key === 'state'">
          <a-tag v-if="text === 'enable'" color="#87d068">{{
            appStore.dict!.dict_item_state.find((v: any) => v.itemValue === text).itemText
          }}</a-tag>
          <a-tag v-else color="pink">{{
            appStore.dict!.dict_item_state.find((v: any) => v.itemValue === text).itemText
          }}</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除吗？" placement="topRight" @confirm="handleDelete(record)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </a-drawer>
  <dict-item-edit-modal ref="dictItemEditModalRef" :onSuccess="fetchTableData" />
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from "vue";
import { message } from "ant-design-vue";
import mainService from "@/services/main";
import DictItemEditModal from "./DictItemEditModal.vue";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const dictItemEditModalRef = ref();
const state = reactive({
  dictId: "",
  visible: false,
});
const initTableProps = () => ({
  columns: [
    {
      width: 50,
      title: "序号",
      dataIndex: "num",
      key: "num",
      fixed: "left",
    },
    {
      title: "字典项名称",
      dataIndex: "itemText",
      key: "itemText",
    },
    {
      title: "字典项值",
      dataIndex: "itemValue",
      key: "itemValue",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "排序",
      dataIndex: "sortNo",
      key: "sortNo",
    },
    {
      title: "是否启用",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "操作",
      width: 140,
      dataIndex: "action",
      key: "action",
      fixed: "right",
    },
  ],
  dataSource: [],
  loading: false,
});
const tableProps = reactive(initTableProps());

const fetchTableData = async () => {
  tableProps.loading = true;
  const res = await mainService.sysDictItemList({
    data: {
      dictId: state.dictId,
    },
  });
  tableProps.loading = false;

  if (res.data?.code === 200) {
    tableProps.dataSource = res.data.data;
  }
};

// 编辑
const handleEdit = async (record: Record<string, any>) => {
  dictItemEditModalRef.value.open(record);
};

// 删除
const handleDelete = async (record: Record<string, any>) => {
  const res = await mainService.sysDictItemDelete({
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

// 关闭抽屉
const handleClose = async () => {
  state.visible = false;
  Object.assign(tableProps, initTableProps());
};

// 打开抽屉
const open = async (record: Record<string, any>) => {
  state.dictId = record.id;
  state.visible = true;

  fetchTableData();
};

// 需要暴露出去的属性
defineExpose({
  open,
});
</script>

<style scoped></style>
