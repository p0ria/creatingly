export declare enum WsEvent {
    CurrentState = "CurrentState",
    ElChanged = "ElChanged"
}
export type Id = string;
export type UiElement = {
    id: Id;
    updatedAt: number;
    style: Record<string, string>;
};
