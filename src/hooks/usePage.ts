import { computed, reactive, ref, unref } from "vue";
import type { TableColumnsType, TableColumnType, PaginationProps, TableProps } from "ant-design-vue";
import utils from "@/utils/utils";

export default <T extends object>({
  initSearchFormState,
  initColumns,
  pageServiceCall,
}: {
  initSearchFormState: () => T;
  initColumns: () => TableColumnsType;
  pageServiceCall: (payload: any) => Promise<TableProps | undefined>;
}) => {
  const searchFormRef = ref();
  const searchFormState = reactive<T>(initSearchFormState());
  const initFetchTableDataPayload = () => ({
    current: 1,
    size: 10,
    ...utils.filterEmpty(initSearchFormState()), // 不用 searchFormState，是因为搜索框显示内容和实际的payload不一致（没点击搜索按钮的情况下，实际是未生效的）
  });
  const fetchTableDataPayload = reactive(initFetchTableDataPayload());
  const initTableProps = () => ({
    columns: initColumns(),
    dataSource: [] as TableProps["dataSource"],
    pagination: {} as PaginationProps,
    loading: false,
  });
  const tableProps = reactive(initTableProps());
  const initRowSelectionProps = () => ({
    selectedRowKeys: [] as string[],
  });
  const rowSelectionProps = reactive(initRowSelectionProps());

  const fetchTableData = async () => {
    tableProps.loading = true;

    const data = await pageServiceCall(fetchTableDataPayload);

    tableProps.loading = false;

    if (data) {
      tableProps.dataSource = data.dataSource;
      tableProps.pagination = {
        ...data.pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number) => `共 ${total} 条`,
        pageSizeOptions: ["10", "20", "30", "40", "50"],
      };
    }
  };

  // 搜索框搜索
  const searchFormSubmit = async () => {
    utils.filterEmpty(
      Object.assign(fetchTableDataPayload, {
        current: 1,
        size: 10,
        ...searchFormState,
      })
    );

    fetchTableData();
  };

  // 搜索框重置
  const searchFormReset = () => {
    searchFormRef.value.resetFields();
    utils.filterEmpty(Object.assign(fetchTableDataPayload, initSearchFormState()));

    fetchTableData();
  };

  // 重置Page状态
  const resetState = () => {
    Object.assign(searchFormState, initSearchFormState());
    Object.assign(fetchTableDataPayload, initFetchTableDataPayload());
    Object.assign(tableProps, initTableProps());
    Object.assign(rowSelectionProps, initRowSelectionProps());
  };

  // table 事件 S --
  const tableEvents = {
    change: (pag: PaginationProps, filters: any, sorter: any) => {
      Object.assign(fetchTableDataPayload, {
        current: pag?.current,
        size: pag?.pageSize,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });

      fetchTableData();
    },
    /**
     * 列拖动
     * 需要设置 column 中的 resizable 属性为 true, resizable 前提条件是 width 为 number
     * @param w
     * @param col
     */
    resizeColumn: (w: number, col: TableColumnType) => {
      col.width = w;
    },
  };
  // table 事件 E --

  // rowSelection 事件 S --
  const rowSelectionEvents = {
    onChange: (selectedRowKeys: string[]) => {
      rowSelectionProps.selectedRowKeys = selectedRowKeys;
    },
  };
  // rowSelection 事件 E --

  return {
    searchFormRef,
    searchFormState,
    tableProps,
    rowSelectionProps,
    fetchTableData,
    searchFormSubmit,
    searchFormReset,
    resetState,
    tableEvents,
    rowSelectionEvents,
  };
};
