import { useCallback } from "react";
import useContextSelector from "../useContextSelector";
import identity from "lodash/identity";

export const makeByIdSelector = id => state => state.byId[id];

export default (StateCtx, DispatchCtx) => ({
  useSelector: (selector = identity) => useContextSelector(StateCtx, selector),
  useResourceSelector: (id, select = identity) => {
    const selector = useCallback(
      state => select(makeByIdSelector(id)(state)),
      []
    );
    return useContextSelector(StateCtx, selector);
  },
  useAction: actionKey =>
    useContextSelector(DispatchCtx, actions => actions[actionKey])
});
