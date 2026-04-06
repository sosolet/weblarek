import { Api } from '../base/Api';
import { IProductItem, IOrder, IOrderResult, IProductListApi } from '../../types';
import { IEvents } from '../base/Events';

export class ApiModel extends Api {
  cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options); 
    this.cdn = cdn;
  }

  // Получение данных
  get ProductList(): Promise<IProductItem[]> {
    return this.get<IProductListApi>('/product').then((data: IProductListApi) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image
      }))
    );
  }

  emitProductsLoaded(events: IEvents): void {
    events.emit('catalog:get');
  }

  // Отправка данных и получение результата оплаты
  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post<IOrderResult>('/order', order);
  }
}
