<template>
  <div class="login_page">
    <div class="login_form">
      <div class="login_form_title">{{ TITLE }}</div>
      <a-form ref="formRef" :rules="formRules" :model="formState" @finish="handleFormFinish">
        <a-form-item name="username">
          <a-input v-model:value="formState.username" placeholder="账号" size="large" allowClear>
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password v-model:value="formState.password" placeholder="密码" size="large" allowClear>
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button class="login_form_button" :loading="state.loading" size="large" type="primary" html-type="submit"
            >登录</a-button
          >
        </a-form-item>
      </a-form>
      <DefaultFooter />
    </div>
    <Particles id="tsparticles" :particlesInit="particlesInit" :url="BASE_URL + 'json/particles.json'" />
  </div>
</template>

<script setup lang="ts">
import type { Rule } from "ant-design-vue/es/form";
import { ref, reactive, onMounted } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import DefaultFooter from "@/components/DefaultFooter.vue";
import md5 from "blueimp-md5";
import mainService from "@/services/main";
import { useRouter } from "vue-router";
import { TITLE } from "@/utils/constant";
import globalData from "@/utils/globalData";
import storageKey from "@/utils/storageKey";
import store from "store";
import { loadFull } from "tsparticles";

const BASE_URL = process.env.BASE_URL;
const router = useRouter();
const formRules: Record<string, Rule[]> = {
  username: [{ required: true, message: "请输入账号" }],
  password: [{ required: true, message: "请输入密码" }],
};
const formRef = ref();
const state = reactive({
  loading: false,
});
const formState = reactive({
  username: "admin",
  password: "admin",
});

// 提交
const handleFormFinish = async () => {
  const res = await formRef.value.validateFields();

  if (!res.errorFields) {
    state.loading = true;
    const res2 = await mainService.authLogin({
      data: {
        username: formState.username,
        password: md5(formState.password).toLocaleUpperCase(),
      },
    });
    state.loading = false;

    if (res2.data?.code === 200) {
      store.set(storageKey.APP_TOKEN, res2.data.data.token);
      globalData.appToken = res2.data.data.token;

      router.push("/");
    }
  }
};

const particlesInit = async (engine: any) => {
  await loadFull(engine);
};

onMounted(() => {});
</script>

<style scoped lang="less">
.login_page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: url("~@/assets/img/login_bg.jpg");
  background-size: cover;
  #tsparticles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.3;
  }
  .login_form {
    position: relative;
    background: #ffffff;
    padding: 35px;
    box-shadow: 0 1px 15px rgb(0 21 41 / 20%);
    border-radius: 3px;
    width: 420px;
    z-index: 2;
    .login_form_title {
      height: 60px;
      line-height: 60px;
      margin-bottom: 20px;
      text-align: center;
      color: rgba(0, 0, 0, 0.85);
      font-size: 30px;
    }
    .login_form_button {
      width: 100%;
    }
  }
}
</style>
