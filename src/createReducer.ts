import { IfcAction } from "./interfaces";
import type { ReducerHandlers, LikeState } from "./types";

export default (handlers: ReducerHandlers) => {
  return (state: LikeState, action: IfcAction) => {
    if (handlers.hasOwnProperty(action.type))
      return handlers[action.type](state, action);

    return state;
  };
};
