<template>
  <footer class="ant-pro-global-footer">
    <div class="ant-pro-global-footer-copyright">Copyright <copyright-outlined /> {{ copyright }}</div>
  </footer>
</template>

<script setup lang="ts">
import { CopyrightOutlined } from "@ant-design/icons-vue";

withDefaults(
  defineProps<{
    copyright?: string;
  }>(),
  {
    copyright: "2023 问卷调查 版本 v0.1.0",
  }
);
</script>

<style scoped lang="less">
.ant-pro-global-footer {
  margin: 16px 0;
  padding: 0 16px;
  text-align: center;
}
.ant-pro-global-footer-copyright {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
</style>
