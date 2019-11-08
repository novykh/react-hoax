import useContextSelector from "../useContextSelector";
import identity from "lodash/identity";

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

export default (StateCtx, DispatchCtx) => ({
  useSelector: (selector = identity) => useContextSelector(StateCtx, selector),
  useAction: actionKey =>
    useContextSelector(DispatchCtx, actions => actions[actionKey])
});
