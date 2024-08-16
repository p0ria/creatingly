export type DocName = string;
export type Id = string;

export type UiElement = {
  id: Id;
  updatedAt: number;
  style: Record<string, string>;
};

export enum WsEvent {
  DocsList = "DocsList",
  NewDoc = "NewDoc",
  SwitchDoc = "SwitchDoc",
  DocState = "DocState",
  ElChanged = "ElChanged",
  NewEl = "NewEl",
}

export type DocsListData = DocName[];

export type NewDocData = DocName;

export type SwitchDocData = DocName;

export type DocStateData = {
  doc: DocName;
  state: Record<Id, UiElement>;
};

export type ElChangedData = {
  doc: string;
  el: UiElement;
};

export type NewElData = {
  doc: string;
  el: UiElement;
};
