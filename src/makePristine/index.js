/**
  const {getInitialPristineState, updatePristine, removePristine} = makePristine('SOME_KEY');

  const init = (initialCount) => ({
    count: initialCount,
    ...getInitialPristineState()
  });

  const reducer = (state, action) => {
    switch (action.type) {
      case 'increment':
        const newValue = state.count + 1;
        state = updatePristine(state, 'count', newValue)
        return {...state, count: newValue};

      case 'decrement':
        const newValue = state.count - 1;
        state = updatePristine(state, 'count', newValue)
        return {...state, count: newValue};

      case 'reset':
        return init(action.payload);

      case 'resetPristine':
        return removePristine(state, 'count')

      default:
        throw new Error();
    }
  }
*/
import set from '../helpers/set';
import get from '../helpers/get';
import has from '../helpers/has';
import omit from '../helpers/omit';
import deepEqual from '../helpers/deepEqual';

const PRISTINE = 'pristine';

export default (pristineKey = PRISTINE) => {
  const getInitialState = () => ({[pristineKey]: {}});

  const hasKey = (state, key) => has(state[pristineKey], key);

  const add = (state, key) =>
    set(state, `${pristineKey}.${key}`, get(state, key));

  const remove = (state, key) => {
    if (!key) return {...state, ...getInitialState()};
    if (!hasKey(state, key)) return state;

    return {
      ...state,
      [pristineKey]: omit(state[pristineKey], [key]),
    };
  };

  return {
    updatePristine: (state, key, newValue) => {
      const hasPristineState = hasKey(state, key);
      if (!hasPristineState && !deepEqual(newValue, get(state, key)))
        return add(state, key);

      if (hasPristineState && deepEqual(newValue, state[pristineKey][key]))
        return remove(state, key);

      return state;
    },
    removePristine: remove,
    getInitialPristineState: getInitialState,
    getPristineState: state => state[pristineKey],
  };
};
