<template>
  <a-drawer
    :body-style="{ padding: '16px' }"
    :width="720"
    title="模块授权"
    placement="right"
    v-model:visible="state.visible"
    :destroyOnClose="true"
    @close="handleClose"
  >
    <a-tree
      checkable
      :defaultExpandAll="true"
      v-model:checkedKeys="state.checkedKeys"
      :tree-data="state.treeData"
      :field-names="fieldNames"
    >
    </a-tree>
    <template #footer>
      <a-space>
        <a-button @click="handleClose">取消</a-button>
        <a-button type="primary" ghost @click="handleSave(0)">保存</a-button>
        <a-button type="primary" @click="handleSave(1)">保存并关闭</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from "vue";
import { message, type TreeProps } from "ant-design-vue";
import mainService from "@/services/main";

const fieldNames: TreeProps["fieldNames"] = {
  key: "id",
  title: "name",
};
const state = reactive<{
  roleId: string;
  visible: boolean;
  checkedKeys: string[];
  treeData: TreeProps["treeData"];
}>({
  roleId: "",
  visible: false,
  checkedKeys: [],
  treeData: [],
});

// 拉取模块树数据
const fetchTreeData = async () => {
  const p1 = mainService.sysModuleTree();
  const p2 = mainService.sysModuleIdListByRole({
    data: {
      roleId: state.roleId,
    },
  });

  const res = await Promise.all([p1, p2]);

  if (res[0].data?.code === 200 && res[1].data?.code === 200) {
    state.treeData = res[0].data.data;
    state.checkedKeys = res[1].data.data;
  }
};

// 保存
const handleSave = async (flag: number) => {
  const res = await mainService.sysRoleModuleUpdateBatch({
    data: {
      roleId: state.roleId,
      moduleIdList: state.checkedKeys,
    },
  });

  if (res.data?.code === 200) {
    if (flag) {
      handleClose();
    } else {
      message.success(res.data.msg);
    }
  }
};

// 关闭抽屉
const handleClose = async () => {
  state.visible = false;
  state.checkedKeys = [];
};

// 打开抽屉
const open = async (record: Record<string, any>) => {
  state.roleId = record.id;
  state.visible = true;
  fetchTreeData();
};

// 需要暴露出去的属性
defineExpose({
  open,
});
</script>

<style scoped></style>
