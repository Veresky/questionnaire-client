<template>
  <a-dropdown class="action">
    <GlobalOutlined />
    <template #overlay>
      <a-menu class="ant-pro-global-header-right-menu" :selected-keys="selectedKeys">
        <a-menu-item v-for="item in state.langs" :key="item.key" @click="setLanguage(item.key)">
          <icon>
            <template #component>{{ item.aliasKey }}</template>
          </icon>
          <span>{{ item.name }}</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import Icon, { GlobalOutlined } from "@ant-design/icons-vue";
import { reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/stores/app";

interface Lang {
  key: string;
  aliasKey: string;
  name: string;
}

interface State {
  langs: Lang[];
  selectedKeys: string[];
}

const { locale } = useI18n();
const { setLanguage } = useAppStore();
const state: State = reactive({
  langs: [
    {
      key: "zh_CN",
      aliasKey: "🇨🇳",
      name: "简体中文",
    },
    {
      key: "en_US",
      aliasKey: "🇺🇸",
      name: "English",
    },
  ],
  selectedKeys: [locale.value],
});
const selectedKeys = computed(() => [locale.value]);
</script>

<style scoped lang="less"></style>
