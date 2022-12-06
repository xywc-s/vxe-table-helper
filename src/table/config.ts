import { uuid } from '@xywc-s/utils'
import type { VxeGridProps, VxeGridPropTypes, VxeGridEventProps } from 'vxe-table'
import type { Ref } from 'vue'

/**
 * 表格分页器配置参数
 */
export type TablePagerProps = VxeGridPropTypes.PagerConfig & {
  /**
   * 页码键名
   */
  pageKey?: string
  /**
   * 每页数据量别名
   */
  pageSizeKey?: string
}

/**
 * 表格API接口配置参数
 */
export interface TableApiProps<T = any, R = any> {
  /**
   * 接口函数
   */
  fn: () => Promise<R>
  /**
   * 接口调用前后的钩子
   */
  hooks?: {
    /**
     * 调用前钩子
     * @return 重构后将传递的接口参数
     */
    before?: <T extends Record<string, any> = any, BR extends Record<string, any>>(params: T) => BR
    /**
     * 接口调用成功后的钩子
     * @param result 接口调用成功后返回的值
     * @param $options 表格选项, 响应式对象, 解构将失去响应性
     */
    success?: (result: R, $options: T) => void
    /**
     * 接口调用失败后的钩子
     * @param result 接口调用失败后的响应结果
     * @param $options 表格选项, 响应式对象, 解构将失去响应性
     */
    error?: (result, $options: T) => void
  }
}
/**
 * 表格API接口
 */
export interface TableApi<T, QR = any, CR = any, DR = any, UR = any> {
  /**
   * 查询接口
   */
  query: TableApiProps<T, QR>
  /**
   * 更新接口
   */
  update: TableApiProps<T, UR>
  /**
   * 删除接口
   */
  delete: TableApiProps<T, DR>
  /**
   * 新增接口
   */
  create: TableApiProps<T, CR>
}

export type BaseTableApi<T, QR = any> = Partial<Pick<TableApi<T, QR>, 'query'>>

/**
 * 表格基础选项
 */
export type BaseOptions = VxeGridProps &
  VxeGridEventProps & {
    pagerConfig?: TablePagerProps
    filters?: Ref<unknown>
  }

/**
 * 基础查询表格选项
 */
export interface BaseTableOptions<T, QR> extends BaseOptions {
  api?: BaseTableApi<T, QR>
}

export interface CrudTableOptions<T, QR, CR, DR, UR> extends BaseOptions {
  api?: Partial<TableApi<T, QR, CR, DR, UR>>
}

/**
 * 表格默认选项配置
 */
export const defaultOptions: BaseOptions = {
  id: uuid(),
  data: [],
  maxHeight: 650,
  size: 'small',
  showHeader: true,
  showOverflow: true,
  autoResize: true,
  syncResize: true,
  stripe: true,
  round: true,
  columnConfig: {
    minWidth: '120px',
    resizable: true
  },
  rowConfig: {
    isCurrent: true,
    isHover: true,
    keyField: 'id'
  },
  pagerConfig: {
    enabled: true,
    layouts: [
      'Sizes',
      'PrevJump',
      'PrevPage',
      'Number',
      'NextPage',
      'NextJump',
      'FullJump',
      'PageCount',
      'Total'
    ],
    currentPage: 1,
    pageSize: 10,
    total: 0,
    pageKey: 'page',
    pageSizeKey: 'pageSize'
  }
}
