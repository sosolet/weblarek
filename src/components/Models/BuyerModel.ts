import { IBuyer, TBuyerError } from '../../types';
import { IEvents } from '../base/Events';

export class BuyerModel {
  protected _buyerInfo: IBuyer;

  constructor(protected events: IEvents) {
    this._buyerInfo = {
      address: '',
      email: '',
      phone: '',
      payment: ''
    };
  }

  // Получение данных о покупателе
  get buyerInfo(): IBuyer {
    return this._buyerInfo;
  }
  
  // Запись данных, которых ещё нет о покупателе
  set buyerInfo(data: Partial<IBuyer>) {
    this._buyerInfo = { ...this._buyerInfo, ...data }
    this.events.emit('buyer:changed');
  } 

  // Очистка данных о покупателе
  clearBuyerInfo(): void {
    this._buyerInfo = {
      address: '',
      email: '',
      phone: '',
      payment: ''
    };
    this.events.emit('buyer:clear');
  }

  // Валидация данных о покупателе (Поля не пустые)
  validateBuyer(): TBuyerError {
    const error: TBuyerError = {}; 
    (Object.keys(this.buyerInfo) as (keyof IBuyer)[]).forEach((val) => {
      if (!this.buyerInfo[val]) {
        error[val] = `Необходимо заполнить поле ${val}`;
      }
    })
    return error;
  }
}
