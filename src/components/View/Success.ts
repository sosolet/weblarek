import { IEvents } from '../base/Events';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export class Success {
  protected _success: HTMLElement;
  protected _description: HTMLParagraphElement;
  protected _button: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this._success = cloneTemplate<HTMLElement>(template);
    this._description = ensureElement<HTMLParagraphElement>('.order-success__description', this._success);
    this._button = ensureElement<HTMLButtonElement>('.order-success__close', this._success);

    this._button.addEventListener('click', () => { events.emit('success:close') });
  }

  render(total: number): HTMLElement {
    this._description.textContent = String(`Списано ${total} синапсов`);
    return this._success;
  }
}