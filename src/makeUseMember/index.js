import { useCallback } from "react";
import useContextSelector from "../useContextSelector";
import identity from "lodash/identity";

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
  select = identity
}) => {
  const selector = useCallback(
    state => {
      const member = resourceId ? select(resourceId)(state) : select(state);
      return [member[fieldKey], member.errors];
    },
    [resourceId, fieldKey]
  );
  const [value, errors] = useContextSelector(StateCtx, selector);

  const updateSelector = useCallback(
    state => {
      const update = getUpdate(resourceId)(state);

      if (typeof update !== "function")
        throw new Error("useMember expects an 'update' dispatch function");

      return resourceId ? (key, v) => update(resourceId, key, v) : update;
    },
    [resourceId]
  );
  const update = useContextSelector(DispatchCtx, updateSelector);

  const setValue = useCallback(v => update(fieldKey, v), [update, fieldKey]);

  const error = errors[fieldKey];
  const setError = useCallback(
    e => update("errors", { ...errors, [fieldKey]: e }),
    [update, errors]
  );

  return [value, setValue, error, setError];
};
