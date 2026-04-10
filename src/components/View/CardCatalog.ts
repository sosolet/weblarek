import { IActions } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';
import { Card } from './Card';

export interface ICardCatalogView {
  category(category: string): void;
  title(title: string): void;
  image(image: string): void;
  price(price: number | null): void;
}

export class CardCatalog extends Card {
  protected _cardCategory: HTMLSpanElement;
  protected _cardImage: HTMLImageElement;
  protected _categoryType = <Record<string, string>>{
    'дополнительное': 'additional',
    'софт-скил': 'soft',
    'кнопка': 'button',
    'хард-скил': 'hard',
    'другое': 'other',
  }

  constructor(container: HTMLElement, protected events: IEvents, actions?: IActions) {
    super(container, events)
    this._cardCategory = ensureElement<HTMLSpanElement>('.card__category', this.container);
    this._cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    
    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  set category(value: string) {
    this._cardCategory.textContent = value;
    this._cardCategory.className = `card__category card__category_${this._categoryType[value]}`;
  }

  set image(value: string) {
    this._cardImage.src = CDN_URL + value;
    this._cardImage.alt = this._cardTitle.textContent;
  }
}