import { IProductItem } from "../../types";

export class BasketModel {
  protected _basketProducts: IProductItem[];

  constructor() {
    this._basketProducts = [];
  }

  // Получение всего списка в корзине
  get basketProducts(): IProductItem[] {
    return this._basketProducts;
  }

  // Запись в корзину
  addBasketProducts(data: IProductItem) {
    if (!this.checkProduct(data.id)) {
      this._basketProducts.push(data);
    }
  }

  // Удаление позиции из корзины
  deleteProduct(data: IProductItem): void {
    this._basketProducts.splice(this._basketProducts.indexOf(data), 1);
  }

  // Очистка корзины
  clearBasket(): void {
    this._basketProducts = [];
  }

  // Получение полной суммы коризны
  getTotalSum(): number {
    return this.basketProducts.reduce((acc, val) => { return acc += val.price || 0 }, 0);
  }

  // Получение количества товаров в корзине
  getCountProducts(): number {
    return this.basketProducts.length;
  }

  // Проверка наличия продукта по id
  checkProduct(id: string): boolean {
    return this.basketProducts.some((val) => val.id === id);
  }
} 