import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export interface IFormView {
  valid(value: boolean): void;
  formErrors(error: string): void;
}

export class Form extends Component<IFormView> {
  protected _formErrors: HTMLElement;
  protected _buttonSubmit: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    this._formErrors = ensureElement<HTMLHeadingElement>('.form__errors', this.container);
    this._buttonSubmit = ensureElement<HTMLButtonElement>('.button', this.container);
  }

  set valid(value: boolean) {
    this._buttonSubmit.disabled = !value;
  }

  set formErrors(error: string) {
    this._formErrors.textContent = error;
  }
}