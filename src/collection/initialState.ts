import type { LikeState } from "../types";

/**
 *  @constant collectionHoax.initialState
 *  @access private
 *  @default {
 *    loading: true,
 *    loaded: false,
 *    processing: false,
 *    byId: {},
 *    ids: []
 *  }
 */
const initialState: LikeState = {
  loading: true,
  loaded: false,
  processing: false,
  byId: {},
  ids: [],
};

export default initialState;
