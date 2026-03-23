import { Api } from '../base/Api';
import { IProductItem, IOrder, IOrderResult, IProductListApi } from '../../types';

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

  // Отправка данных и получение результата оплаты
  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post<IOrderResult>('/order', order);
  }
}
