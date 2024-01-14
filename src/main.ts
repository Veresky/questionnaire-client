import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import i18n from "@/utils/i18n";
import antdHelper from "@/utils/antdHelper";
import iconFontHelper from "@/utils/iconFontHelper";
import Particles from "particles.vue3";

const app = createApp(App);

// 装载路由
app.use(router);

// 国际化
app.use(i18n);

// pinia
app.use(createPinia());

// Particles
app.use(Particles);

// 注册antd组件
antdHelper(app);

// 自定义图标字体
iconFontHelper(app);

// 挂载到节点
app.mount("#app");
