export type Attr = string | number;

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
