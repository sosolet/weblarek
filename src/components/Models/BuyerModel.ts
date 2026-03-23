import { IBuyer, TBuyerError } from "../../types";

export class BuyerModel {
  protected _buyerInfo: IBuyer;

  constructor() {
    this._buyerInfo = {
      addres: '',
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
  } 

  // Очистка данных о покупателе
  clearBuyerInfo(): void {
    this._buyerInfo = {
      addres: '',
      email: '',
      phone: '',
      payment: ''
    };
  }

  // Валидация данных о покупателе (Поля не пустые)
  validateBuyer(): TBuyerError[] {
    const dataValid: TBuyerError[] = []; 
    (Object.keys(this.buyerInfo) as (keyof IBuyer)[]).forEach((val) => {
      if (!this.buyerInfo[val]) {
        dataValid.push({
          valid: false,
          messege: `Поле ${val} должно быть заполнено!`
        })
      }
    })
    return dataValid;
  }
}
