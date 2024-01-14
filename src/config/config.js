/**
 * 项目配置信息
 */

const config = {
  local: {
    baseURL: {
      // 接口
      main: "http://localhost:8090/service/",
      // 链接
      portalURL: "123", // portal
    },
    appId: 1, // portal中生成的appId
  },
  sit: {
    baseURL: {
      // 接口
      main: "",
      // 链接
      portalURL: "123",
    },
    appId: 2,
  },
  uat: {
    baseURL: {
      // 接口
      main: "",
      // 链接
      portalURL: "123",
    },
    appId: 3,
  },
  prod: {
    baseURL: {
      // 接口
      main: "https://questionnaire-service-8423a5c6bce1.herokuapp.com/demo/api/questionnaire/",
      // 链接
      portalURL: "123",
    },
    appId: 4,
  },
};

module.exports = config[process.env.VUE_APP_ENV];
