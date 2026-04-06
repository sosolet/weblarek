import { cloneTemplate, ensureElement, createElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Basket {
  protected _basket: HTMLElement;
  protected _title: HTMLHeadingElement;
  protected _basketList: HTMLUListElement;
  protected _button: HTMLButtonElement;
  protected _basketPrice: HTMLSpanElement;
  protected _headerBasketButton: HTMLButtonElement;
  protected _headerBasketCounter: HTMLSpanElement;
  
  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this._basket = cloneTemplate<HTMLElement>(template);
    this._title = ensureElement<HTMLHeadingElement>('.modal__title', this._basket);
    this._basketList = ensureElement<HTMLUListElement>('.basket__list', this._basket);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this._basket); 
    this._basketPrice = ensureElement<HTMLSpanElement>('.basket__price', this._basket);
    this._headerBasketButton = ensureElement<HTMLButtonElement>('.header__basket');
    this._headerBasketCounter = ensureElement<HTMLSpanElement>('.header__basket-counter');
    
    this._button.addEventListener('click', () => { this.events.emit('order:open') });
    this._headerBasketButton.addEventListener('click', () => { this.events.emit('basket:open') });

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._basketList.replaceChildren(...items);
      this._button.removeAttribute('disabled');
    } else {
      this._button.setAttribute('disabled', 'disabled');
      this._basketList.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
    }
  }

  basketCounter(value: number): void {
    this._headerBasketCounter.textContent = String(value);
  }
  
  setTotalSum(totalSum: number): void {
    this._basketPrice.textContent = `${totalSum} синапсов`;
  }

  render(): HTMLElement {
    this._title.textContent = 'Корзина';
    return this._basket;
  }
}