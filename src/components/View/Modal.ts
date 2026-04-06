import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Modal {
  protected _modalContainer: HTMLElement;
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  
  constructor(modalContainer: HTMLElement, protected events: IEvents) {
    this._modalContainer = modalContainer;
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this._modalContainer);
    this._content = ensureElement<HTMLElement>('.modal__content', this._modalContainer);

    this._closeButton.addEventListener('click', this.close.bind(this));
    this._modalContainer.addEventListener('click', this.close.bind(this));
    ensureElement<HTMLElement>('.modal__container', this._modalContainer).addEventListener('click', event => event.stopPropagation());
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open(): void {
    this._modalContainer.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close(): void {
    this._modalContainer.classList.remove('modal_active');
    this.events.emit('modal:close');
  }

  render(): HTMLElement {
    this.open();
    return this._modalContainer;
  }
}