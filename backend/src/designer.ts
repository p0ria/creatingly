import { Id, UiElement } from "./types";

export const designer = {
  state: {} as Record<Id, UiElement>,
  update(el: UiElement) {
    this.state = {
      ...this.state,
      [el.id]: el,
    };
  },
  add(el: UiElement) {
    this.state = {
      ...this.state,
      [el.id]: el,
    };
  },
};
