import type { LikeState } from "../types";

/**
 *  @constant memberHoax.initialState
 *  @access private
 *  @default {
 *    loading: true,
 *    loaded: false,
 *    processing: false,
 *    errors: {}
 *  }
 */

const initialState: LikeState = {
  loading: true,
  loaded: false,
  processing: false,
  errors: {},
};

export default initialState;
