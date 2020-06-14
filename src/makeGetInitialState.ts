import type { LikeState } from "./types";

type GetInitialState = () => LikeState;

interface IfcMakeInitialStates {
  getInitialState: GetInitialState | undefined;
  defaultInitialState: GetInitialState;
}

export default ({
  getInitialState,
  defaultInitialState,
}: IfcMakeInitialStates) => {
  if (!getInitialState) return () => defaultInitialState;

  return () => ({ ...defaultInitialState, ...getInitialState() });
};
