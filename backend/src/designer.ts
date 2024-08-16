import { DocName, Id, UiElement } from "./types";

export const designer = {
  docs: [] as DocName[],
  state: {} as Record<DocName, Record<Id, UiElement>>,
  addDoc(doc: DocName) {
    if (!this.docs[doc]) {
      this.docs.push(doc);
    }
  },
  updateEl(doc: DocName, el: UiElement) {
    this.state[doc] = {
      ...(this.state[doc] || {}),
      [el.id]: el,
    };
  },
  addEl(doc: DocName, el: UiElement) {
    this.state[doc] = {
      ...(this.state[doc] || {}),
      [el.id]: el,
    };
  },
};
