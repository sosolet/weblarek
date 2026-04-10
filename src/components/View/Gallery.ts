import { IEvents } from "../base/Events";
import { Component } from "../base/Component";

export interface GalleryView {
  items(items: HTMLElement[]): void;
}

export class Gallery extends Component<GalleryView> {
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}