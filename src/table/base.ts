import { reactive, ref, Ref } from 'vue'
import { get, useToggle } from '@vueuse/core'
import { assign, cloneDeep, isFunction, merge, set } from 'lodash-es'
import { defaultOptions } from './config'
import type {
  BaseTableOptions,
  BaseOptions,
  BaseTableApi,
  TableApiProps,
  TablePagerProps
} from './config'
import type { VxeGridPropTypes } from 'vxe-table'

/**
 * 基础查询表格
 */
export class BaseTable<R = any> {
  _options: BaseTableOptions<BaseOptions, R>
  _loading: Ref<boolean>
  _toggleLoading: (value: boolean | undefined) => boolean
  _filters: Ref<unknown>
  _api: BaseTableApi<BaseOptions, R>

  /**
   * 基础表格构造器
   * @param {object} options 表格默认配置项
   */
  constructor(options?: BaseTableOptions<BaseOptions, R>) {
    // 表格loading状态和切换状态方法
    const [loading, toggleLoading] = useToggle(false)
    this._loading = loading
    this._toggleLoading = toggleLoading

    // 生成表格选项
    this._options = reactive(cloneDeep(merge({}, defaultOptions, options)))
    this._options.loading = loading
    this._filters = this._options?.filters ?? ref({})
    this._api = this._options?.api ?? {}

    // 没有自定义分页器事件, 初始化默认事件
    if (!this._options?.onPageChange) this._initPagerEvents()
  }

  /**
   * 设置表格数据
   */
  setData<T>(data: T[]) {
    this._options.data = data
    return this
  }

  /**
   * 获取表格数据
   */
  getData() {
    return this._options.data
  }

  /**
   * 设置表格列配置
   */
  setColumns(columns: VxeGridPropTypes.Columns) {
    this._options.columns = columns
    return this
  }

  /**
   * 初始化分页器事件
   */
  _initPagerEvents() {
    this._options.onPageChange = ({ type, currentPage, pageSize }) => {
      switch (type) {
        case 'current':
          this._options.pagerConfig.currentPage = currentPage
          this.fetchData({
            [this._options.pagerConfig.pageKey]: currentPage,
            [this._options.pagerConfig.pageSizeKey]: pageSize
          })
          break
        case 'size':
          this._options.pagerConfig.pageSize = pageSize
          this.fetchData({
            [this._options.pagerConfig.pageKey]: 1,
            [this._options.pagerConfig.pageSizeKey]: pageSize
          })
          break
      }
    }
  }

  /**
   * 设置分页器
   * 此处配置的别名优先级更高
   */
  setPager(pager: TablePagerProps) {
    this._options.pagerConfig = pager
    return this
  }

  /**
   * 获取分页器状态
   */
  getPager() {
    return this._options.pagerConfig
  }

  /**
   * 设置表格查询参数
   */
  setFilters<T>(filters: Ref<T>) {
    this._filters = ref(filters)
    return this
  }

  /**
   * 设置表格接口
   * @param params 查询接口函数或查询接口的配置对象
   */
  setApi<QR = R>(params: TableApiProps<BaseOptions, QR>) {
    set(this._api, 'query', params)
  }

  /**
   * 表格数据加载方法
   * @param data 接口额外传递的参数(最高优先级, 将覆盖filters和pager中的同名参数)
   */
  fetchData = (data: Record<string, unknown> = {}) => {
    if (!this._api.query)
      throw new Error('表格未初始化获取数据接口, 请先调用 setApi 方法完成接口初始化!')
    if (!isFunction(this._api.query.fn)) throw new Error('查询接口函数必须是一个Promise函数')

    this._toggleLoading(true)
    let params: Record<string, unknown> = {}
    // 如果配置了分页器, 将分页参数设置为接口参数
    if (this._options.pagerConfig?.enabled) {
      params = {
        [this._options.pagerConfig.pageKey]: this._options.pagerConfig.currentPage,
        [this._options.pagerConfig.pageSizeKey]: this._options.pagerConfig.pageSize
      }
    }
    // 将过滤器和附件参数设置为接口参数
    params = assign(params, get(this._filters), data)

    if (this._api.query.hooks?.before) {
      const refactoryParams = this._api.query.hooks.before(params)
      if (refactoryParams) params = refactoryParams
    }

    this._api.query
      .fn(params)
      .then((result) => {
        if (this._api.query.hooks?.success) {
          this._api.query.hooks.success(result, this._options)
        }
      })
      .catch((reason) => {
        if (this._api.query.hooks?.error) this._api.query.hooks.error(reason, this._options)
      })
      .finally(() => this._toggleLoading(false))
  }

  use = () => ({
    tableOptions: this._options,
    tableLoading: this._loading,
    fetchData: this.fetchData
  })
}
