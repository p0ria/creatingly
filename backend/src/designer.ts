import { Id, UiElement } from "./types";
import { nanoid } from "nanoid";

export const designer = {
  state: {} as Record<Id, UiElement>,
  update(el: UiElement) {
    this.state = {
      ...this.state,
      [el.id]: el,
    };
  },
};

const id1 = nanoid(),
  id2 = nanoid(),
  updatedAt = +new Date();
designer.state = {
  [id1]: {
    id: id1,
    style: {
      left: "280px",
      top: "300px",
      width: "100px",
      height: "100px",
      "background-color": "#fde047",
    },
    updatedAt,
  },
  [id2]: {
    id: id2,
    style: {
      left: "420px",
      top: "300px",
      width: "100px",
      height: "100px",
      "background-color": "#fca5a5",
      "border-radius": "100%",
    },
    updatedAt,
  },
};
