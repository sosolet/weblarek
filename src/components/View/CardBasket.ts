import { IActions } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { Card } from './Card';

export interface IBasketProductView {
  index: number;
  title: string;
  price: string | null;
}

export class CardBasket extends Card {
	protected _index: HTMLSpanElement;
	protected _buttonDelete: HTMLButtonElement;

  constructor (container: HTMLElement, protected events: IEvents, actions?: IActions) {
		super(container, events);
		this._index = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
		this._buttonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

		if (actions?.onClick) {
			this._buttonDelete.addEventListener('click', actions.onClick);
		}
  }

	set index(value: number) {
    this._index.textContent = String(value);
  }
}