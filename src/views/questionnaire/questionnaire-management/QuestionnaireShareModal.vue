<template>
  <a-modal width="950px" centered :title="state.modalTitle" v-model:visible="state.visible" :footer="null">
    <a-form :label-col="{ span: 3 }">
      <a-form-item label="问卷链接">
        <a-input-group compact>
          <a-input v-model:value="state.url" style="width: calc(100% - 64px)" />
          <a-button class="copy" @click="handleCopyUrl" :data-clipboard-text="state.url" type="primary">复制</a-button>
        </a-input-group>
      </a-form-item>
      <a-form-item label="二维码">
        <div ref="qrcodeRef"></div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onUnmounted } from "vue";
import { message } from "ant-design-vue";
import QRCode from "qrcodejs2";
import Clipboard from "clipboard";

const state = reactive({
  visible: false,
  modalTitle: "",
  url: "",
});
const qrcodeRef = ref();
let qrcode: any;

// 打开弹框
const open = async (record: Record<string, any>, modalTitle: string) => {
  state.visible = true;
  state.modalTitle = modalTitle;
  state.url = location.origin + location.pathname + "#/questionnaire/survey/" + record.id;
  await nextTick();

  if (qrcode) {
    qrcode.makeCode(state.url);
  } else {
    qrcode = new QRCode(qrcodeRef.value, {
      text: state.url,
      width: 128,
      height: 128,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.L,
    });
  }
};

// 复制链接
const handleCopyUrl = () => {
  let clipboard = new Clipboard(".copy");
  clipboard.on("success", (e) => {
    message.success("复制成功");
    // 释放内存
    clipboard.destroy();
  });
  clipboard.on("error", (e) => {
    // 不支持复制
    message.warn("该浏览器不支持自动复制");
    // 释放内存
    clipboard.destroy();
  });
};

onUnmounted(() => {
  qrcode && qrcode.clear();
});

// 需要暴露出去的属性
defineExpose({
  open,
});
</script>

<style scoped></style>
