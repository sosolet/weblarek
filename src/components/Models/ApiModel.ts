import { ApiPostMethods, IApi, IApiModel, IOrder, IOrderResult, IProductListApi } from '../../types';

export class ApiModel implements IApiModel {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  // Получение данных
  getProductList(): Promise<IProductListApi> {
    return this.api.get<IProductListApi>('/product/');
  }

  // Отправка данных и получение результата оплаты
  orderProducts(order: IOrder, method: ApiPostMethods = 'POST'): Promise<IOrderResult> {
    return this.api.post<IOrderResult>('/order', order, method);
  }
}