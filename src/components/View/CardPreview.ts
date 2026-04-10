import { Card } from './Card';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';

export class CardPreview extends Card {
  protected _cardPreviewText: HTMLParagraphElement;
  protected _cardPreviewButton: HTMLButtonElement;
  protected _cardCategory: HTMLSpanElement;
  protected _cardImage: HTMLImageElement;
  protected _categoryType = <Record<string, string>>{
    'дополнительное': 'additional',
    'софт-скил': 'soft',
    'кнопка': 'button',
    'хард-скил': 'hard',
    'другое': 'other',
  }

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this._cardPreviewText = ensureElement<HTMLParagraphElement>('.card__text', this.container);
    this._cardPreviewButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
    this._cardCategory = ensureElement<HTMLSpanElement>('.card__category', this.container);
    this._cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);

    this._cardPreviewButton.addEventListener('click', () => { events.emit('preview:toggle') });
  }

  set description(value: string) {
    this._cardPreviewText.textContent = value;
  }

  set category(value: string) {
    this._cardCategory.textContent = value;
    this._cardCategory.className = `card__category card__category_${this._categoryType[value]}`;
  }

  set image(value: string) {
    this._cardImage.src = CDN_URL + value;
    this._cardImage.alt = this._cardTitle.textContent;
  }

  set price(value: number | null) {
    super.price = value;
    if (value) {
      this._cardPreviewButton.removeAttribute('disabled');
      this._cardPreviewButton.textContent = 'Купить';
    } else {
      this._cardPreviewButton.setAttribute('disabled', 'true')
      this._cardPreviewButton.textContent = 'Недоступно';
    }
  }

  updateButton(status: boolean): void {
    if (this._cardPreviewButton.disabled) {
      return;
    }

    if (status) {
      this._cardPreviewButton.textContent = 'Удалить из корзины';
    } else {
      this._cardPreviewButton.textContent = 'Купить';
    }
  }
}