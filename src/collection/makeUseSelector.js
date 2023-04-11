import {useMemo, useCallback} from 'react';
import get from '../helpers/get';
import useContextSelector from '../useContextSelector';
import identity from '../helpers/identity';

export const byIdSelector = id => state => get(state, ['byId', id]);

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

export default (StateCtx, DispatchCtx) => ({
  useSelector: (selector = identity) => useContextSelector(StateCtx, selector),
  useResourceSelector: (id, select = identity) => {
    const selector = useCallback(
      state => select(byIdSelector(id)(state)),
      [id],
    );

    return useContextSelector(StateCtx, selector);
  },
  useAction: actionKey => {
    const selector = useMemo(
      () => (actionKey ? actions => actions[actionKey] : identity),
      [actionKey],
    );
    return useContextSelector(DispatchCtx, selector);
  },
});
