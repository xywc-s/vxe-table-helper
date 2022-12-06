import * as Config from './config'
import * as Base from './base'
import * as Crud from './crud'

/**
 * 基础查询表格
 * @param options 表格选项参数
 */
export function useTable<R = any>(options: Config.BaseTableOptions<Config.BaseOptions, R>) {
  const Table = new Base.BaseTable<R>(options)
  const useTable = Table.use()
  return {
    Table,
    ...useTable
  }
}

/**
 * crud表格
 * @param options 表格选项参数
 */
export function useTableWithCrud<QR = any, CR = any, DR = any, UR = any>(
  options: Config.CrudTableOptions<Config.BaseOptions, QR, CR, DR, UR>
) {
  const CrudTable = new Crud.CrudTable<QR, CR, DR, UR>(options)
  const useTable = CrudTable.use()
  return {
    CrudTable,
    ...useTable
  }
}

export const BaseTable = Base.BaseTable
export const CrudTable = Crud.CrudTable
