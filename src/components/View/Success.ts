import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export interface ISuccessView {
  description(total: number): void;
}

export class Success extends Component<ISuccessView> {
  protected _description: HTMLParagraphElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this._description = ensureElement<HTMLParagraphElement>('.order-success__description', this.container);
    this._button = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this._button.addEventListener('click', () => { events.emit('success:close') });
  }

  set description(total: number) {
    this._description.textContent = String(`Списано ${total} синапсов`);
  }
}