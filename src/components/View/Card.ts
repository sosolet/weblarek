import { IEvents } from '../base/Events';
import { ensureElement, createPrice } from '../../utils/utils';
import { Component } from '../base/Component';

export interface ICardView {
  title(title: string): void;
  price(price: number | null): void;
}

export class Card extends Component<ICardView> {
  protected _cardTitle: HTMLHeadingElement;
  protected _cardPrice: HTMLSpanElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    this._cardTitle = ensureElement<HTMLHeadingElement>('.card__title', this.container);
    this._cardPrice = ensureElement<HTMLSpanElement>('.card__price', this.container);
  }

  set title(value: string) {
    this._cardTitle.textContent = value;
  }

  set price(value: number | null) {
    this._cardPrice.textContent = createPrice(value);
  }
}