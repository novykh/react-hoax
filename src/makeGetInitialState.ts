import type { LikeState, GetState } from "./types";

interface IfcMakeInitialStates {
  getInitialState: GetState | undefined;
  defaultInitialState: LikeState;
}

export default ({
  getInitialState,
  defaultInitialState,
}: IfcMakeInitialStates) => {
  if (!getInitialState) return () => defaultInitialState;

  return () => ({ ...defaultInitialState, ...getInitialState() });
};
