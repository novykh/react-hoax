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

import isEqual from 'lodash/isEqual';

const PRISTINE = 'pristine';

export default (pristineKey = PRISTINE) => {
  const getInitialState = () => ({[pristineKey]: {}});

  const hasKey = (state, key) =>
    !!state[pristineKey] && state[pristineKey].hasOwnProperty(key);

  const add = (state, key) => ({
    ...state,
    [pristineKey]: {
      ...state[pristineKey],
      [key]: state[key],
    },
  });

  const remove = (state, key) => {
    if (!key) return {...state, ...getInitialState()};
    if (!hasKey(state, key)) return state;

    delete state[pristineKey][key];
    return {
      ...state,
      [pristineKey]: {
        ...state[pristineKey],
      },
    };
  };

  return {
    updatePristine: (state, key, newValue) => {
      const hasPristineState = hasKey(state, key);
      if (!hasPristineState && !isEqual(newValue, state[key]))
        return add(state, key);

      if (hasPristineState && isEqual(newValue, state[pristineKey][key]))
        return remove(state, key);

      return state;
    },
    removePristine: remove,
    getInitialPristineState: getInitialState,
    getPristineState: state => state[pristineKey],
  };
};
