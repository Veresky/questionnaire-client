<template>
  <a-modal
    centered
    :title="state.isAdd ? '新增' : '编辑'"
    v-model:visible="state.visible"
    @ok="handleOk"
    :confirmLoading="state.confirmLoading"
  >
    <a-form ref="formRef" :rules="formRules" :model="formState" :label-col="{ span: 4 }">
      <a-form-item name="moduleType" label="模块类型">
        <a-radio-group v-model:value="formState.moduleType">
          <a-radio-button v-for="(item, index) in appStore.dict!.module_type" :key="index" :value="item.itemValue">
            {{ item.itemText }}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item name="parentIdPath" label="父级菜单">
        <a-tree-select
          v-model:value="formState.parentIdPath"
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择"
          allow-clear
          :tree-data="parentTreeData"
          :field-names="{
            children: 'children',
            label: 'name',
            value: 'idPath',
          }"
        >
        </a-tree-select>
      </a-form-item>
      <a-form-item name="name" label="模块名称">
        <a-input v-model:value="formState.name" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item name="path" label="菜单路径" v-if="formState.moduleType === 'menu'">
        <a-input v-model:value="formState.path" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item name="icon" label="图标" v-if="formState.moduleType === 'menu'">
        <a-input v-model:value="formState.icon" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item name="sortNo" label="排序" v-if="formState.moduleType === 'menu'">
        <a-input-number v-model:value="formState.sortNo" :min="1" />
      </a-form-item>
      <a-form-item name="code" label="按钮标识" v-if="formState.moduleType === 'btn'">
        <a-input v-model:value="formState.code" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item name="code" label="授权类型" v-if="formState.moduleType === 'btn'">
        <a-radio-group v-model:value="formState.permissionType">
          <a-radio v-for="(item, index) in appStore.dict!.module_permission_type" :key="index" :value="item.itemValue">
            {{ item.itemText }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import type { Rule } from "ant-design-vue/es/form";
import { reactive, ref, nextTick } from "vue";
import { message } from "ant-design-vue";
import _ from "lodash-es";
import mainService from "@/services/main";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const formRules: Record<string, Rule[]> = {
  moduleType: [{ required: true, message: "请选择" }],
  name: [{ required: true, message: "请输入" }],
};
const initFormState = () => ({
  id: "",
  moduleType: null,
  parentIdPath: "",
  name: "",
  path: "",
  icon: "",
  sortNo: null,
  code: "",
  permissionType: null,
});
const formRef = ref();
const state = reactive({
  visible: false,
  confirmLoading: false,
  isAdd: true,
});
const formState = reactive(initFormState());
const props = defineProps<{
  parentTreeData: any[];
  onSuccess: () => Promise<void>;
}>();

// 确定
const handleOk = async () => {
  const res = await formRef.value.validateFields();

  if (!res.errorFields) {
    state.confirmLoading = true;
    const parentIdPathArr = formState.parentIdPath.split(",");

    const res2 = await mainService.sysModuleEdit({
      data: {
        ...formState,
        parentIdPath: formState.parentIdPath || null,
        parentId: parentIdPathArr[parentIdPathArr.length - 1] || null,
        code: formState.moduleType === "btn" ? formState.code : null,
        permissionType: formState.moduleType === "btn" ? formState.permissionType : null,
        path: formState.moduleType === "menu" ? formState.path : null,
        icon: formState.moduleType === "menu" ? formState.icon : null,
        sortNo: formState.moduleType === "menu" ? formState.sortNo : null,
      },
    });
    state.confirmLoading = false;

    if (res2.data?.code === 200) {
      message.success(res2.data.msg);
      state.visible = false;

      props.onSuccess();
    }
  }
};

// 打开弹框
const open = async (record: Record<string, any>) => {
  if (record?.id) {
    _.each(formState, (v, k) => {
      (formState as any)[k] = record[k];
    });
    state.isAdd = false;
  } else {
    Object.assign(formState, initFormState(), record);
    state.isAdd = true;
  }
  state.visible = true;
};

// 需要暴露出去的属性
defineExpose({
  open,
});
</script>

<style scoped></style>
