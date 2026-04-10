import { IProductItem } from '../../types';
import { IEvents } from '../base/Events';

export class CatalogModel {
  protected _catalogProducts: IProductItem[];
  protected _infoProduct: IProductItem | undefined;

  constructor(protected events: IEvents) {
    this._catalogProducts = [];
    this._infoProduct;
  }

  // Получение списка товаров
  get catalogProducts(): IProductItem[] {
    return this._catalogProducts;
  }

  // Запись списка товаров
  set catalogProducts(data: IProductItem[]) {
    this._catalogProducts = data;
    this.events.emit('catalog:get');
  }

  // Получение подробной информации о товаре
  get infoProduct(): IProductItem | undefined {
    return this._infoProduct;
  }

  // Запись подробной информации о товаре
  set infoProduct(data: IProductItem | undefined) {
    this._infoProduct = data;
    this.events.emit('modal:open', data);
  }

  // Получение продукта по id
  getProduct(id: string): IProductItem | undefined {
    return this._catalogProducts.find((item) => item.id === id);
  }
} 