export type Placement = {
  h: 'left' | 'right';
  v: 'top' | 'bottom';
};

export type ResizeEvent = {
  x: number;
  y: number;
};

export type Id = string;

export type UiElement = {
  id: Id;
  updatedAt: number;
  style: Record<string, string>;
};

export enum WsEvent {
  CurrentState = 'CurrentState',
  ElChanged = 'ElChanged',
}
