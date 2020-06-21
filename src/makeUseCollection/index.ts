import { Context, useCallback } from "react";
import { identity } from "../helpers";
import makeUseMember from "../makeUseMember";

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
 * @description A hook that handles the CRUD operations on a state's collection.
 * @example
 * const {collection, add, push, edit, remove, error, setError} = useCollection({
 *   fieldKey: 'skills'
 * });
 *
 * push('my'); // collection [my]
 * add(0, 'hello'); // collection[hello, my]
 * add(1, 'world'); // collection[hello, world, my]
 * edit(2, 'sorry'); // collection[hello, world, sorry]
 * remove(2); // collection[hello, world]
 */

const makeWithUniq = (uniq: boolean = false) => {
  if (!uniq) return identity;
  return (collection: any[]) => [...new Set(collection)];
};

interface IfcUseCollection {
  fieldKey: Attr;
  resourceId?: Attr | undefined;
  uniq: boolean;
  getUpdate: (x: Attr) => (x: LikeState) => LikeState;
  select: (x: Attr) => (x: LikeState) => LikeState;
}

export default (
  StateCtx: Context<LikeState>,
  DispatchCtx: Context<LikeState>
) => {
  const useMember = makeUseMember(StateCtx, DispatchCtx);

  return ({
    fieldKey,
    resourceId,
    uniq,
    getUpdate,
    select,
  }: IfcUseCollection) => {
    const [collection, setCollection, error, setError] = useMember({
      fieldKey,
      resourceId,
      getUpdate,
      select,
    });
    const normalize = makeWithUniq(uniq);

    const remove = useCallback(
      (index: number) => {
        if (index < 0 || index >= collection.length) return;

        setCollection(
          normalize([
            ...collection.slice(0, index),
            ...collection.slice(index + 1),
          ])
        );
      },
      [collection]
    );

    const edit = useCallback(
      (index: number, value: any) => {
        if (index < 0 || index >= collection.length) return;

        setCollection(
          normalize([
            ...collection.slice(0, index),
            value,
            ...collection.slice(index + 1),
          ])
        );
      },
      [collection]
    );

    const add = useCallback(
      (index: number, value: any) => {
        if (index < 0) return;

        setCollection(
          normalize([
            ...collection.slice(0, index),
            value,
            ...collection.slice(index),
          ])
        );
      },
      [collection]
    );

    const push = useCallback((value: any) => add(collection.length, value), [
      collection,
    ]);

    const reorder = useCallback(
      (startIndex: number, endIndex: number) => {
        if (startIndex < 0 || startIndex >= collection.length) return;
        if (endIndex < 0 || endIndex >= collection.length) return;

        const mutable = [...collection];
        const [removed] = mutable.splice(startIndex, 1);
        mutable.splice(endIndex, 0, removed);
        setCollection(normalize(mutable));
      },
      [collection]
    );

    return {
      collection,
      set: setCollection,
      add,
      push,
      edit,
      remove,
      reorder,
      error,
      setError,
    };
  };
};
