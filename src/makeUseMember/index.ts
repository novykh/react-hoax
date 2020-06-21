import { Context, useCallback } from "react";
import useContextSelector from "../useContextSelector";
import { identity } from "../helpers";
import { makeByIdSelector } from "../collection/makeUseSelector";

import { IfcAction } from "../interfaces";
import type {
  Attr,
  LikeState,
  LikeStateArray,
  GetState,
  Dispatch,
  InputEvent,
  ReducerHandlers,
  Actions,
} from "../types";

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
const defaultGetUpdate = (resourceId: Attr) => (state: LikeState) =>
  resourceId ? state.updateResource : state.update;

const resourceSelect = (
  state: LikeState,
  id: Attr,
  select: (x: Attr) => (y: LikeState) => LikeState = makeByIdSelector
) => select(id)(state);

const rootSelect = (
  state: LikeState,
  select: (z: LikeState) => LikeState = identity
) => select(state);

interface IfcUseMember<ResourceId extends Attr | undefined> {
  fieldKey: Attr;
  resourceId?: ResourceId;
  getUpdate: (x: Attr) => (x: LikeState) => LikeState;
  select?: any;
}

export default (
  StateCtx: Context<LikeState>,
  DispatchCtx: Context<LikeState>
) => ({
  fieldKey,
  resourceId,
  getUpdate = defaultGetUpdate,
  select,
}: IfcUseMember<Attr | undefined>) => {
  const selector = useCallback(
    (state: LikeState) => {
      const member = resourceId
        ? rootSelect(state, select)
        : resourceSelect(state, resourceId, select);
      return [member[fieldKey], member.errors];
    },
    [resourceId, fieldKey]
  );
  const [value, errors] = useContextSelector(StateCtx, selector);

  const updateSelector = useCallback(
    (state: LikeState) => {
      const update = getUpdate(resourceId)(state);

      if (typeof update !== "function")
        throw new Error("useMember expects an 'update' dispatch function");

      return resourceId
        ? (key: Attr, v: any) => update(resourceId, key, v)
        : update;
    },
    [resourceId]
  );
  const update = useContextSelector(DispatchCtx, updateSelector);

  const setValue = useCallback((v: any) => update(fieldKey, v), [
    update,
    fieldKey,
  ]);

  const error = errors[fieldKey];
  const setError = useCallback(
    (e: any) => update("errors", { ...errors, [fieldKey]: e }),
    [update, errors]
  );

  return [value, setValue, error, setError];
};
