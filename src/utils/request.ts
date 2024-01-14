/**
 * 网络请求
 */

import axios from "axios";
import { notification, message } from "ant-design-vue";
import { AxiosRequestCustomConfig } from "@/types/app";
import globalConfig from "@/config/config";
import { useAppStore } from "@/stores/app";
import router from "@/router";
import globalData from "@/utils/globalData";
import i18n from "@/utils/i18n";

/**
 * 异常统一处理
 */
const errorHandler = (url = "", showError: boolean, errorMsg?: string, errorType?: number): void => {
  const msg = errorMsg || "网络错误，请稍后重试";

  if (showError !== false) {
    if (errorType === 1) {
      message.error(msg);
    } else {
      notification.error({
        message: `请求错误: url=${url}`,
        description: msg,
      });
    }
  }
};

/**
 * 请求实例
 */
const instance = axios.create({
  timeout: 30000,
  method: "POST",
});

const request = function (
  {
    showError = true,
    errorMsg,
    errorType,
    showLoading = true,
    loadingMsg,
    loadingType,
    ...config
  }: AxiosRequestCustomConfig,
  type: string
) {
  const appStore = useAppStore();

  if (showLoading !== false) {
    if (loadingType === 1) {
      // TODO: 其他交互
    } else {
      // TODO: 默认交互提示
    }
  }

  // 接口 baseURL 处理 S --
  // 接口不支持跨域，需要代理，本地在 vue.config.js 的 devServer 模块中配置，线上环境一般在 nginx 中配置
  if (type === "main") {
    //config.baseURL = "/service";
    config.baseURL = globalConfig.baseURL[type];
  }

  // 接口支持跨域
  //config.baseURL = globalConfig.baseURL[type];
  // 接口 baseURL 处理 E --

  // mock
  if (type === "mock") {
    config.baseURL = "/mockApi";
  }

  if (type === "main") {
    config.headers = {
      token: globalData.appToken,
      language: i18n.global.locale.value,
      ...config.headers,
    };
  }

  return instance
    .request(config)
    .then((res) => {
      if (showLoading !== false) {
        if (loadingType === 1) {
          // TODO: 其他交互
        } else {
          // TODO: 默认交互提示
        }
      }

      if (res.data) {
        if (type === "main" && res.data?.code === 401) {
          router.push("/auth/login");
        } else if (
          (type === "mock" && res.data.returncode !== "00000") ||
          (type === "main" && res.data?.code !== 200)
        ) {
          errorHandler(config.url, showError, errorMsg || res.data.message || res.data.msg, errorType);
        }
      }

      return res;
    })
    .catch((error) => {
      if (showLoading !== false) {
        if (loadingType === 1) {
          // 其他交互提示
        } else {
          // TODO: 默认交互提示
        }
      }

      errorHandler(
        config.url,
        showError,
        errorMsg || (error.response && error.response.statusText) || error.toString(),
        errorType
      );

      return error;
    });
};

/**
 * mock接口
 */
export function mockRequest(config: AxiosRequestCustomConfig) {
  return request(config, "mock");
}

/**
 * 默认接口
 */
export function mainRequest(config: AxiosRequestCustomConfig) {
  return request(config, "main");
}
