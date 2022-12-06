import { BaseTable } from './base'
import type { BaseOptions, CrudTableOptions, TableApi } from './config'
/**
 * crud表格
 */
export class CrudTable<QR = any, CR = any, DR = any, UR = any> extends BaseTable {
  _options: CrudTableOptions<BaseOptions, QR, CR, DR, UR>
  _api: TableApi<BaseOptions, QR, CR, DR, UR>

  /**
   * 设置表格接口
   * @param api 接口配置
   */
  setApi<Q = QR, C = CR, D = DR, U = UR>(api: Partial<TableApi<BaseOptions, Q, C, D, U>>) {
    this._api = api
  }
}
