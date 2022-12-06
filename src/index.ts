import { merge } from 'lodash-es'
import { defaultOptions, BaseOptions } from './table/config'
export * from './table'

/**
 * 设置表格全局默认值
 * @param options 配置
 */
export const setTable = (options: BaseOptions) => {
  const mergeOptions = merge(defaultOptions, options)
  Object.keys(options).forEach((key) => {
    defaultOptions[key] = mergeOptions[key]
  })
}
