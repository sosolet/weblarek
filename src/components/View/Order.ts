import { IEvents } from '../base/Events';
import { ensureElement, ensureAllElements } from '../../utils/utils';
import { Form } from './Form';

export class Order extends Form {
  protected _buttonAll: HTMLButtonElement[];
  protected _input: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);
    this._buttonAll = Array.from(ensureAllElements<HTMLButtonElement>('.button_alt', this.container));
    this._input = ensureElement<HTMLInputElement>('input', this.container);

    this._buttonAll.forEach(item => {
      item.addEventListener('click', (event: Event) => {
        const target = event.target as HTMLButtonElement;
        const value = target.name;
        events.emit('order:paymentSelection', { payment: value });
      });
    });

    this._input.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const value = target.value;
      events.emit('order:changeAddress', { address: value });
    });

    this.container.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('contacts:open');
    });
  }

  set paymentSelection(paymentMethod: string) {
    this._buttonAll.forEach(item => {
      item.classList.toggle('button_alt-active', item.name === paymentMethod);
    })
  }

  set payment(value: string | null) {
    this._buttonAll[0].classList.toggle('button_alt-active', value === 'card');
    this._buttonAll[1].classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this._input.value = value;
  }
}