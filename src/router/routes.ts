import { RouteRecordRaw } from "vue-router";
import LoginPage from "@/views/auth/LoginPage.vue";
import BasicLayout from "@/layout/BasicLayout.vue";
import DictPage from "@/views/system/dict-management/DictPage.vue";
import ModulePage from "@/views/system/module-management/ModulePage.vue";
import UserPage from "@/views/system/user-management/UserPage.vue";
import RolePage from "@/views/system/role-management/RolePage.vue";
import PermissionPage from "@/views/system/permission-management/PermissionPage.vue";
import OnlinePage from "@/views/monitor/online-monitor/OnlinePage.vue";
import LogPage from "@/views/monitor/log-monitor/LogPage.vue";
import QuestionnairePage from "@/views/questionnaire/questionnaire-management/QuestionnairePage.vue";
import Survey from "@/views/questionnaire/survey/Survey.vue";
import AnswerSheetReview from "@/views/questionnaire/survey/AnswerSheetReview.vue";
import NotFound from "@/views/exception/NotFound.vue";

const routes: Array<RouteRecordRaw> = [
  // 登录
  {
    path: "/auth/login",
    name: "LoginPage",
    component: LoginPage,
  },
  // 问卷调查用户端 S --
  {
    path: "/questionnaire/survey/:questionnaireId",
    name: "Survey",
    component: Survey,
  },
  {
    path: "/questionnaire/answerSheetReview/:answerSheetId",
    name: "AnswerSheetReview",
    component: AnswerSheetReview,
  },
  // 问卷调查用户端 E --
  // 通用布局
  {
    path: "/",
    name: "BasicLayout",
    component: BasicLayout,
    children: [
      // 系统管理 S --
      // 用户管理
      {
        path: "/system/user-management",
        name: "UserPage",
        component: UserPage,
      },
      // 角色管理
      {
        path: "/system/role-management",
        name: "RolePage",
        component: RolePage,
      },
      // 字典管理
      {
        path: "/system/dict-management",
        name: "DictPage",
        component: DictPage,
      },
      // 模块管理
      {
        path: "/system/module-management",
        name: "ModulePage",
        component: ModulePage,
      },
      // 接口管理
      {
        path: "/system/permission-management",
        name: "PermissionPage",
        component: PermissionPage,
      },
      // 系统管理 E --

      // 系统监控 S --
      // 在线用户
      {
        path: "/monitor/online-monitor",
        name: "OnlinePage",
        component: OnlinePage,
      },
      // 系统日志
      {
        path: "/monitor/log-monitor",
        name: "LogPage",
        component: LogPage,
      },
      // 监控管理 E --

      // 问卷调查 S --
      // 问卷管理
      {
        path: "/questionnaire/questionnaire-management",
        name: "QuestionnairePage",
        component: QuestionnairePage,
      },
      // 问卷调查 E --
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

export default routes;
