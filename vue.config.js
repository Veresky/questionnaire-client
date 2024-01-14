const { defineConfig } = require("@vue/cli-service");
const WebpackBar = require("webpackbar");
const mock = require("./mock");
const globalConfig = require("./src/config/config");

module.exports = defineConfig({
  publicPath: "",
  lintOnSave: false,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  devServer: {
    // 本地开发代理API地址
    proxy: {
      "^/demo/api/questionnaire": {
        target: globalConfig.baseURL.main,
        changeOrigin: true, // 是否需要跨域
        secure: true, // https
        ws: true,
        pathRewrite: {
          "^/demo/api/questionnaire": "",
        },
      },
    },
    onBeforeSetupMiddleware: (devServer) => {
      mock(devServer.app);
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        // 临时解决vue-i18n警告（官方还未解决）， "You are running the esm-bundler build of vue-i18n".
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      },
    },
    plugins: [new WebpackBar()],
    performance: {
      maxEntrypointSize: 1024 * 1024, // 最大入口文件大小
      maxAssetSize: 1024 * 1024, // 最大资源文件大小
    },
    experiments: {
      topLevelAwait: true, // 支持顶层await
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "问卷调查";
      return args;
    });
  },
});
