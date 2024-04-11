import { createApp } from "vue";
import "@/assets/css/style.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import FullShow from "./components/FullShow.vue";

const app = createApp(App);
// 注册全部图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.component("FullShow", FullShow);
app.use(ElementPlus, { size: "default", zIndex: 3000, locale: zhCn });
app.mount("#app");
