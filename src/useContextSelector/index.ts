import { useRef, Context } from "react";
import { identity, isEqual } from "../helpers";
import { useContextSelector } from "use-context-selector";

import { IfcAction } from "../interfaces";
import type {
  Attr,
  LikeState,
  LikeStateArray,
  GetState,
  Dispatch,
  InputEvent,
} from "../types";

export default (
  Ctx: Context<LikeState>,
  select: (x: LikeState) => LikeState = identity
) => {
  const prevRef = useRef<any>();
  return useContextSelector(Ctx, (state: LikeState) => {
    const selected = select(state);
    if (!isEqual(prevRef.current, selected)) prevRef.current = selected;
    return prevRef.current;
  });
};
