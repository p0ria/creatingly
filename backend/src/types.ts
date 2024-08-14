export enum WsEvent {
  CurrentState = "CurrentState",
  ElChanged = "ElChanged",
  NewEl = "NewEl",
}

export type Id = string;

export type UiElement = {
  id: Id;
  updatedAt: number;
  style: Record<string, string>;
};
