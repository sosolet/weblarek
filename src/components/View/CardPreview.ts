import { Card } from './Card';
import { IActions, IProductItem } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement, createPrice } from '../../utils/utils';

export class CardPreview extends Card {
  protected _cardPreviewText: HTMLParagraphElement;
  protected _cardPreviewButton: HTMLButtonElement;
  protected _flag: boolean;

  constructor(template: HTMLTemplateElement, protected events: IEvents, flag: boolean, actions?: IActions) {
    super(template, events, actions);

    this._cardPreviewText = ensureElement<HTMLParagraphElement>('.card__text', this._cardElement);
    this._cardPreviewButton = ensureElement<HTMLButtonElement>('.card__button', this._cardElement);
    this._flag = flag;
    this._cardPreviewButton.addEventListener('click', () => { this.events.emit('card:addPosition') });
  }

  isPriceless(price: number | null): string {
    if(price) {
      return 'Купить';
    } else {
      this._cardPreviewButton.setAttribute('disabled', 'true')
      return 'Недоступно';
    }
  }

  inBasket(data: IProductItem, flag: boolean) {
    if (flag) {
      this._cardPreviewButton.addEventListener('click', () => { this.events.emit('card:deletePosition') });
      return 'Удалить из корзины';
    } else {
      return this.isPriceless(data.price);
    }
  }

  render(data: IProductItem): HTMLElement {
    this._cardCategory.textContent = data.category;
    this._cardCategory.className = this.isCategory(data.category);
    this._cardTitle.textContent = data.title;
    this._cardImage.src = data.image;
    this._cardImage.alt = this._cardTitle.textContent;
    this._cardPrice.textContent = createPrice(data.price);
    this._cardPreviewText.textContent = data.description;
    this._cardPreviewButton.textContent = this.inBasket(data, this._flag);
    return this._cardElement;
  }
}