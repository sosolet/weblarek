import { IEvents } from '../base/Events';
import { cloneTemplate, ensureAllElements, ensureElement } from '../../utils/utils';

export class Contacts {
  protected _formContacts: HTMLFormElement;
  protected _inputAll: HTMLInputElement[];
  protected _buttonSubmit: HTMLButtonElement;
  protected _formErrors: HTMLSpanElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this._formContacts = cloneTemplate<HTMLFormElement>(template);
    this._inputAll = Array.from(ensureAllElements<HTMLInputElement>('.form__input', this._formContacts));
    this._buttonSubmit = ensureElement<HTMLButtonElement>('.button', this._formContacts);
    this._formErrors = ensureElement<HTMLSpanElement>('.form__errors', this._formContacts);

    this._inputAll.forEach(item => {
      item.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        const field = target.name;
        const value = target.value;
        events.emit('contacts:contactsInput', { field, value });
        events.emit('formErrors:contacts');
      })
    })

    this._formContacts.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('success:open');
    });
  }

  set valid(value: boolean) {
    this._buttonSubmit.disabled = !value;
  }

  set formErrors(error: string) {
    this._formErrors.textContent = error;
  }

  render(): HTMLElement {
    return this._formContacts
  }
}