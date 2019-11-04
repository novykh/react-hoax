import useContextSelector from "../useContextSelector";
import identity from "lodash/identity";

export default (StateCtx, DispatchCtx, ...selectors) => ({
  useSelector: (selector = identity) => useContextSelector(StateCtx, selector),
  useAction: actionKey =>
    useContextSelector(DispatchCtx, actions => actions[actionKey])
});
