import {useCallback} from 'react';
import get from 'lodash/get';
import useContextSelector from '../useContextSelector';
import identity from 'lodash/identity';
import {makeByIdSelector} from '../collection/makeUseSelector';

/**
 * @description A hook that handles the mutate operations on a state's member.
 * @example
 * const [title, setTitle, error, setError] = useMember({
 *   fieldKey: 'title'
 * });
 *
 * setTitle('hello'); // state.title === 'hello'
 * setError('myError'); // state.errors.title === 'myError'
 */
const defaultGetUpdate = resourceId => state =>
  resourceId ? state.updateResource : state.update;

export default (StateCtx, DispatchCtx) => ({
  fieldKey,
  resourceId,
  getUpdate = defaultGetUpdate,
  select = resourceId ? makeByIdSelector : identity,
}) => {
  const selector = useCallback(
    state => {
      const member = resourceId ? select(resourceId)(state) : select(state);
      return [get(member, fieldKey), get(member, `errors.${fieldKey}`)];
    },
    [resourceId, fieldKey],
  );
  const [value, error] = useContextSelector(StateCtx, selector);

  const updateSelector = useCallback(
    state => {
      const update = getUpdate(resourceId)(state);

      if (typeof update !== 'function')
        throw new Error("useMember expects an 'update' dispatch function");

      return resourceId ? (key, v) => update(resourceId, key, v) : update;
    },
    [resourceId],
  );
  const update = useContextSelector(DispatchCtx, updateSelector);

  const setValue = useCallback(v => update(fieldKey, v), [update, fieldKey]);

  const setError = useCallback(e => update(`errors.${fieldKey}`, e), [
    update,
    fieldKey,
  ]);

  return [value, setValue, error, setError];
};
