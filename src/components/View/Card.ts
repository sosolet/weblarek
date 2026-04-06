import { IProductItem, IActions } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement, cloneTemplate, createPrice } from '../../utils/utils';

export class Card {
  protected _cardElement: HTMLButtonElement;
  protected _cardCategory: HTMLSpanElement;
  protected _cardTitle: HTMLHeadingElement;
  protected _cardImage: HTMLImageElement;
  protected _cardPrice: HTMLSpanElement;
  protected _categoryType = <Record<string, string>>{
    'дополнительное': 'additional',
    'софт-скил': 'soft',
    'кнопка': 'button',
    'хард-скил': 'hard',
    'другое': 'other',
  }

  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    this._cardElement = cloneTemplate<HTMLButtonElement>(template);
    this._cardCategory = ensureElement<HTMLSpanElement>('.card__category', this._cardElement);
    this._cardTitle = ensureElement<HTMLHeadingElement>('.card__title', this._cardElement);
    this._cardImage = ensureElement<HTMLImageElement>('.card__image', this._cardElement);
    this._cardPrice = ensureElement<HTMLSpanElement>('.card__price', this._cardElement);
    
    if (actions?.onClick) {
      this._cardElement.addEventListener('click', actions.onClick);
    }
  }

  protected isCategory(category: string): string {
    return`card__category card__category_${this._categoryType[category]}`;
  }

  render(data: IProductItem): HTMLElement {
    this._cardCategory.textContent = data.category;
    this._cardCategory.className = this.isCategory(data.category);
    this._cardTitle.textContent = data.title;
    this._cardImage.src = data.image;
    this._cardImage.alt = this._cardTitle.textContent;
    this._cardPrice.textContent = createPrice(data.price);
    return this._cardElement;
  }
}