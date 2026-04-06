import { IEvents } from '../base/Events';
import { cloneTemplate, ensureElement, ensureAllElements } from '../../utils/utils';

export class Order {
  protected _formOrder: HTMLFormElement;
  protected _buttonAll: HTMLButtonElement[];
  protected _buttonSubmit: HTMLButtonElement;
  protected _formErrors: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this._formOrder = cloneTemplate<HTMLFormElement>(template);
    this._buttonAll = Array.from(ensureAllElements<HTMLButtonElement>('.button_alt', this._formOrder));
    this._buttonSubmit = ensureElement<HTMLButtonElement>('.order__button', this._formOrder);
    this._formErrors = ensureElement<HTMLSpanElement>('.form__errors', this._formOrder);

    this._buttonAll.forEach(item => {
      item.addEventListener('click', () => {
        this.paymentSelection = item.name;
        events.emit('order:paymentSelection', item);
        events.emit('formErrors:order');
      });
    });

    this._formOrder.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const value = target.value;
      events.emit('order:changeAddress', { address: value });
      events.emit('formErrors:order');
    });

    this._formOrder.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('contacts:open');
    });
  }

  set paymentSelection(paymentMethod: string) {
    this._buttonAll.forEach(item => {
      item.classList.toggle('button_alt-active', item.name === paymentMethod);
    })
  }

  set valid(value: boolean) {
    this._buttonSubmit.disabled = !value;
  }

  set formErrors(error: string) {
    this._formErrors.textContent = error;
  }

  render(): HTMLElement {
    return this._formOrder;
  }
}