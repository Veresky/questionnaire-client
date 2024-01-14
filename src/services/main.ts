import { mainRequest, mockRequest } from "@/utils/request";
import { AxiosRequestCustomConfig } from "@/types/app";

const main = {
  // 登录登出
  authLogin(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "auth/login",
      ...config,
    });
  },
  authLogout() {
    return mainRequest({
      url: "auth/logout",
    });
  },
  authCurrentUser() {
    return mainRequest({
      url: "auth/currentUser",
    });
  },

  // 用户
  sysUserPage(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/user/page",
      ...config,
    });
  },
  syUserEdit(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/user/edit",
      ...config,
    });
  },
  sysUserDelete(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/user/delete",
      ...config,
    });
  },
  sysUserUpdatePassword(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/user/updatePassword",
      ...config,
    });
  },
  sysUserResetPassword(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/user/resetPassword",
      ...config,
    });
  },

  // 用户角色
  sysRolePageByUser(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/userRole/pageByUser",
      ...config,
    });
  },
  sysUserRoleSaveBatch(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/userRole/saveBatch",
      ...config,
    });
  },
  sysUserRoleRemoveByIds(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/userRole/removeByIds",
      ...config,
    });
  },

  // 角色
  sysRolePage(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/role/page",
      ...config,
    });
  },
  syRoleEdit(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/role/edit",
      ...config,
    });
  },
  sysRoleDelete(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/role/delete",
      ...config,
    });
  },

  // 角色模块
  sysModuleIdListByRole(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/roleModule/moduleIdListByRole",
      ...config,
    });
  },
  sysRoleModuleUpdateBatch(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/roleModule/updateBatch",
      ...config,
    });
  },

  // 角色权限
  sysPermissionPageByRole(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/rolePermission/pageByRole",
      ...config,
    });
  },
  sysRolePermissionSaveBatch(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/rolePermission/saveBatch",
      ...config,
    });
  },
  sysRolePermissionRemoveByIds(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/rolePermission/removeByIds",
      ...config,
    });
  },

  // 字典
  sysDictPage(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/dict/page",
      ...config,
    });
  },
  sysDictEdit(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/dict/edit",
      ...config,
    });
  },
  sysDictDelete(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/dict/delete",
      ...config,
    });
  },
  sysDictAll() {
    return mainRequest({
      url: "sys/dict/all",
    });
  },

  // 字典项
  sysDictItemList(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/dictItem/list",
      ...config,
    });
  },
  sysDictItemEdit(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/dictItem/edit",
      ...config,
    });
  },
  sysDictItemDelete(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/dictItem/delete",
      ...config,
    });
  },

  // 模块
  sysModuleTree() {
    return mainRequest({
      url: "sys/module/tree",
    });
  },
  sysModuleEdit(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/module/edit",
      ...config,
    });
  },
  sysModuleDelete(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/module/delete",
      ...config,
    });
  },

  // 权限
  sysPermissionPage(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/permission/page",
      ...config,
    });
  },
  sysPermissionEdit(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/permission/edit",
      ...config,
    });
  },
  sysPermissionRemoveByIds(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "sys/permission/removeByIds",
      ...config,
    });
  },

  // 在线用户
  monitorOnlineList() {
    return mainRequest({
      url: "monitor/online/list",
    });
  },

  // 系统日志
  monitorLogPage(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "monitor/log/page",
      ...config,
    });
  },

  // 问卷管理
  questionnaireQuestionnairePage(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "questionnaire/questionnaire/page",
      ...config,
    });
  },
  questionnaireQuestionnaireDetail(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "questionnaire/questionnaire/detail",
      ...config,
    });
  },
  questionnaireQuestionnaireEdit(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "questionnaire/questionnaire/edit",
      ...config,
    });
  },
  questionnaireQuestionnaireDelete(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "questionnaire/questionnaire/delete",
      ...config,
    });
  },
  questionnaireQuestionListWithQuestionOption(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "questionnaire/question/listWithQuestionOption",
      ...config,
    });
  },
  questionnaireQuestionSaveBatchWithQuestionOption(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "questionnaire/question/saveBatchWithQuestionOption",
      ...config,
    });
  },
  questionnaireAnswerSheetPage(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "questionnaire/answerSheet/page",
      ...config,
    });
  },
  questionnaireAnswerSheetDetail(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "questionnaire/answerSheet/detail",
      ...config,
    });
  },
  questionnaireAnswerSheetDelete(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "questionnaire/answerSheet/delete",
      ...config,
    });
  },
  questionnaireAnswerSheetCountsByQuestionnaireId(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "questionnaire/answerSheet/countsByQuestionnaireId",
      ...config,
    });
  },
  questionnaireAnswerCountGroupByQuestionOption(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "questionnaire/answer/countGroupByQuestionOption",
      ...config,
    });
  },

  // 问卷用户端
  questionnaireSurveySave(config: AxiosRequestCustomConfig) {
    return mainRequest({
      url: "questionnaire/survey/save",
      ...config,
    });
  },

  // xx
};

export default main;
