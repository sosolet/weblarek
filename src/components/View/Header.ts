import { IEvents } from "../base/Events";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface HeaderView {
  basketCounter(value: number): void;
}

export class Header extends Component<HeaderView> {
  protected _headerBasketButton: HTMLButtonElement;
  protected _headerBasketCounter: HTMLSpanElement;
  
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this._headerBasketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this._headerBasketCounter = ensureElement<HTMLSpanElement>('.header__basket-counter', this.container);

    this._headerBasketButton.addEventListener('click', () => { this.events.emit('basket:open') });
  }

  basketCounter(value: number): void {
    this._headerBasketCounter.textContent = String(value);
  }
}