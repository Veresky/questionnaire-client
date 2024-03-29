/**
 * antd组件全局模块化引入
 */

import {
  Button,
  Form,
  Input,
  Alert,
  Layout,
  Menu,
  Tooltip,
  Avatar,
  Dropdown,
  Badge,
  Card,
  Table,
  Row,
  DatePicker,
  TimePicker,
  Select,
  Col,
  InputNumber,
  Breadcrumb,
  ConfigProvider,
  Result,
  Tabs,
  Divider,
  Pagination,
  Modal,
  Checkbox,
  Radio,
  Spin,
  Popconfirm,
  Drawer,
  Switch,
  Tag,
  TreeSelect,
  Tree,
  Space,
  Descriptions,
} from "ant-design-vue";
import type { App } from "vue";

export default function antdHelper(app: App) {
  [
    Button,
    Form,
    Input,
    Alert,
    Layout,
    Menu,
    Tooltip,
    Avatar,
    Dropdown,
    Badge,
    Card,
    Table,
    Row,
    DatePicker,
    TimePicker,
    Select,
    Col,
    InputNumber,
    Breadcrumb,
    ConfigProvider,
    Result,
    Tabs,
    Divider,
    Pagination,
    Modal,
    Checkbox,
    Radio,
    Spin,
    Popconfirm,
    Drawer,
    Switch,
    Tag,
    TreeSelect,
    Tree,
    Space,
    Descriptions,
  ].forEach((v: any) => {
    app.use(v);
  });
}
