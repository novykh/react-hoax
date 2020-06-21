import { IfcAction } from "./interfaces";

export type Attr = string | number;

export type Action =
  | IfcAction
  | ((...args: any[]) => IfcAction)
  | ((...args: any[]) => (x: Dispatch, y: GetState, e: any) => void);

export type Actions = {
  [key: string]: Action;
};

export type LikeState = {
  [key: string]: any;
  [key: number]: any;
};

export type LikeStateArray = { attr: Attr; value: any }[];

export type InputEvent = {
  target: {
    name: string;
    value: string | number | undefined;
  };
};

export type GetState = () => LikeState;

export type Dispatch = (key: Action) => Action | void;

export type Reducer = (state: LikeState, action: IfcAction) => LikeState;

export type ReducerHandlers = { [key: string]: Reducer };
