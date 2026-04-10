import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Component } from '../base/Component';

export interface IBasketView {
  setTotalSum(totalSum: number): void;
}

export class Basket extends Component<IBasketView> {
  protected _title: HTMLHeadingElement;
  protected _basketList: HTMLUListElement;
  protected _button: HTMLButtonElement;
  protected _basketPrice: HTMLSpanElement;
  
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this._title = ensureElement<HTMLHeadingElement>('.modal__title', this.container);
    this._basketList = ensureElement<HTMLUListElement>('.basket__list', this.container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container); 
    this._basketPrice = ensureElement<HTMLSpanElement>('.basket__price', this.container);
    
    this._button.addEventListener('click', () => { this.events.emit('order:open') });

    this.items = [];
    this._title.textContent = 'Корзина';
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._basketList.replaceChildren(...items);
      this._button.removeAttribute('disabled');
    } else {
      this._basketList.replaceChildren();
      this._button.setAttribute('disabled', 'disabled');
    }
  }
  
  setTotalSum(totalSum: number): void {
    this._basketPrice.textContent = `${totalSum} синапсов`;
  }
}