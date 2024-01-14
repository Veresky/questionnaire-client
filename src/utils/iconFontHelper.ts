/**
 * 自定义图标
 */
import { createFromIconfontCN } from "@ant-design/icons-vue";
import type { App } from "vue";

export default function iconFontHelper(app: App) {
  const IconFont = createFromIconfontCN({
    scriptUrl: `${process.env.BASE_URL}js/iconfont.js`, // 在 iconfont.cn 上生成
  });
  app.component("IconFont", IconFont);
}
