<template>
  <a-breadcrumb>
    <a-breadcrumb-item>
      <router-link :to="firstLinkOfMenu">主页</router-link>
    </a-breadcrumb-item>
    <a-breadcrumb-item v-for="item in breadcrumbData" :key="item.id">{{ item.name }}</a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup lang="ts">
import { SysModuleItem } from "@/types/app";

defineProps<{
  firstLinkOfMenu: string;
  breadcrumbData: SysModuleItem[];
}>();
</script>

<style scoped lang="less"></style>
