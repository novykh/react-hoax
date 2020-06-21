import { Context, useMemo, useCallback } from "react";
import useContextSelector from "../useContextSelector";
import { identity } from "../helpers";

import { IfcAction } from "../interfaces";
import type {
  Attr,
  LikeState,
  LikeStateArray,
  GetState,
  Dispatch,
  InputEvent,
  ReducerHandlers,
  Reducer,
  Actions,
} from "../types";

export const makeByIdSelector = (id: Attr) => (state: LikeState): LikeState =>
  state.byId[id];

/**
 * @typedef {Object} collectionHoax.Selectors
 * @property {function} useSelector - `useSelector(state => state)` select a part of state
 * @property {function} useResourceSelector - `useResourceSelector(id, state => state)` select a part of a resource's state (byId)
 * @property {function} useAction - `useAction('actionName')` select the action you need to dispatch for the member
 */

/**
 *  @function collectionHoax.makeUseSelector
 *  @access private
 *  @param {object} StateCtx - the context with the member state
 *  @param {object} DispatchCtx - the context with the member dispatches / actions
 *  @return {collectionHoax.Selectors}
 */

export default (
  StateCtx: Context<LikeState>,
  DispatchCtx: Context<LikeState>
) => ({
  useSelector: (selector: (x: LikeState) => LikeState = identity) =>
    useContextSelector(StateCtx, selector),
  useResourceSelector: (
    id: Attr,
    select: (x: LikeState) => LikeState = identity
  ) => {
    const selector = useCallback(
      (state: LikeState) => select(makeByIdSelector(id)(state)),
      [id]
    );
    return useContextSelector(StateCtx, selector);
  },
  useAction: (actionKey: Attr) => {
    const selector = useMemo(
      () => (actionKey ? (actions: Actions) => actions[actionKey] : identity),
      [actionKey]
    );
    return useContextSelector(DispatchCtx, selector);
  },
});
