import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export interface IModalView {
  content(value: HTMLElement): void;
  open(): void;
  close(): void;
}

export class Modal extends Component<IModalView> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this._content = ensureElement<HTMLElement>('.modal__content', this.container);

    this._closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    ensureElement<HTMLElement>('.modal__container', this.container).addEventListener('click', event => event.stopPropagation());
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
  }
}