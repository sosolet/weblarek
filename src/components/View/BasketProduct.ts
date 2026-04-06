import { IActions, IProductItem } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement, cloneTemplate, createPrice } from '../../utils/utils';

export class BasketProduct {
  protected _basketItem: HTMLElement;
	protected _index: HTMLSpanElement;
	protected _title: HTMLSpanElement;
	protected _price: HTMLSpanElement;
	protected _buttonDelete: HTMLButtonElement;

  constructor (template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    this._basketItem = cloneTemplate<HTMLButtonElement>(template);
		this._index = ensureElement<HTMLSpanElement>('.basket__item-index', this._basketItem);
		this._title = ensureElement<HTMLSpanElement>('.card__title', this._basketItem);
		this._price = ensureElement<HTMLSpanElement>('.card__price', this._basketItem);
		this._buttonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this._basketItem);

		if (actions?.onClick) {
			this._buttonDelete.addEventListener('click', actions.onClick);
		}
  }

	render(data: IProductItem, item: number): HTMLElement {
		this._index.textContent = String(item);
		this._title.textContent = data.title;
		this._price.textContent = createPrice(data.price);
		return this._basketItem;
	}
}