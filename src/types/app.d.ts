import { AxiosRequestConfig } from "axios";

// 全局变量
export interface GlobalData {
  appGuid: string;
  appToken: string;
}

// 自定义AxiosRequestConfig
export interface AxiosRequestCustomConfig extends AxiosRequestConfig {
  showError?: boolean;
  errorMsg?: string;
  errorType?: number;
  showLoading?: boolean;
  loadingMsg?: string;
  loadingType?: number;
}

interface SysModuleItem {
  name: string;
  path: string;
  moduleType: string;
  id: string;
  parentId: string;
  idPath: string;
  hideInMenu: boolean;
  icon: string;
  children?: SysModuleItem[];
}

interface TabPane extends SysModuleItem {
  component: any;
  routePath: string;
  refreshing: boolean;
}
