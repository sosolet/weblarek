import { IEvents } from '../base/Events';
import { ensureAllElements } from '../../utils/utils';
import { Form } from './Form';

export class Contacts extends Form {
  protected _inputAll: HTMLInputElement[];

  constructor(container: HTMLTemplateElement, protected events: IEvents) {
    super(container, events);
    this._inputAll = Array.from(ensureAllElements<HTMLInputElement>('.form__input', this.container));

    this._inputAll.forEach(item => {
      item.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        const field = target.name;
        const value = target.value;
        events.emit('contacts:contactsInput', { field, value });
      })
    })

    this.container.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('success:open');
    });
  }

  set email(value: string) {
    this._inputAll[0].value = value;
  }

  set phone(value: string) {
    this._inputAll[1].value = value;
  }
}