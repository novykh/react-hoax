import { Context, useMemo } from "react";
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
  Actions,
} from "../types";

/**
 * @typedef {Object} memberHoax.Selectors
 * @property {function} useSelector - `useSelector(state => state)` select a part of member's state
 * @property {function} useAction - `useAction('actionName')` select the action you need to dispatch for the member
 */

/**
 *  @function memberHoax.makeUseSelector
 *  @access private
 *  @param {object} StateCtx - the context with the member state
 *  @param {object} DispatchCtx - the context with the member dispatches / actions
 *  @return {memberHoax.Selectors}
 */

export default (
  StateCtx: Context<LikeState>,
  DispatchCtx: Context<LikeState>
) => ({
  useSelector: (selector: (x: LikeState) => LikeState = identity) =>
    useContextSelector(StateCtx, selector),
  useAction: (actionKey: Attr) => {
    const selector = useMemo(
      () => (actionKey ? (actions: Actions) => actions[actionKey] : identity),
      [actionKey]
    );
    return useContextSelector(DispatchCtx, selector);
  },
});
