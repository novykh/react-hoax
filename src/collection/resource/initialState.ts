import type { LikeState } from "../../types";

const initialState: LikeState = {
  loading: true,
  loaded: false,
  processing: false,
  errors: {},
};

export default initialState;
