import makePristine from './index';

const test = (expectedKey, pristineKey) => {
  it('has initialState and functions update, remove', () => {
    const {
      getInitialPristineState,
      updatePristine,
      removePristine,
    } = makePristine(pristineKey);
    expect(getInitialPristineState()).toEqual({
      [pristineKey || 'pristine']: {},
    });
    expect(typeof updatePristine === 'function').toBeTruthy();
    expect(typeof removePristine === 'function').toBeTruthy();
  });

  describe('#updatePristine', () => {
    it('updates pristine state when none before', () => {
      const {updatePristine} = makePristine(pristineKey);
      expect(updatePristine({}, 'attr', 'newValue')).toEqual({
        [expectedKey]: {attr: undefined},
      });

      expect(updatePristine({attr: 'prevValue'}, 'attr', 'newValue')).toEqual({
        attr: 'prevValue',
        [expectedKey]: {attr: 'prevValue'},
      });
    });

    it('removes pristine state when previous was the same', () => {
      const {updatePristine} = makePristine(pristineKey);
      expect(
        updatePristine({[expectedKey]: {attr: 'value'}}, 'attr', 'value'),
      ).toEqual({[expectedKey]: {}});

      expect(
        updatePristine(
          {[expectedKey]: {attr: 'value', attr2: 'value2'}},
          'attr2',
          'value2',
        ),
      ).toEqual({
        [expectedKey]: {attr: 'value'},
      });
    });

    it('does nothing when receives new value, but already has pristine', () => {
      const {updatePristine} = makePristine(pristineKey);
      expect(
        updatePristine({[expectedKey]: {attr: 'value'}}, 'attr', 'newValue'),
      ).toEqual({
        [expectedKey]: {attr: 'value'},
      });

      expect(
        updatePristine(
          {[expectedKey]: {attr: 'value', attr2: 'value2'}},
          'attr2',
          'newValue2',
        ),
      ).toEqual({
        [expectedKey]: {attr: 'value', attr2: 'value2'},
      });
    });
  });

  describe('#removePristine', () => {
    it('removes pristine key', () => {
      const {removePristine} = makePristine(pristineKey);
      expect(removePristine({[expectedKey]: {attr: 'value'}}, 'attr')).toEqual({
        [expectedKey]: {},
      });

      expect(
        removePristine(
          {[expectedKey]: {attr: 'value', attr2: 'value2'}},
          'attr2',
        ),
      ).toEqual({
        [expectedKey]: {attr: 'value'},
      });
    });

    it('resets pristine to initial state', () => {
      const {removePristine} = makePristine(pristineKey);
      expect(removePristine({[expectedKey]: {attr: 'value'}})).toEqual({
        [expectedKey]: {},
      });

      expect(
        removePristine({[expectedKey]: {attr: 'value', attr2: 'value2'}}),
      ).toEqual({
        [expectedKey]: {},
      });
    });

    it('does nothing when no pristine', () => {
      const {removePristine} = makePristine(pristineKey);
      expect(
        removePristine({[expectedKey]: {attr: 'value'}}, 'attr2'),
      ).toEqual({[expectedKey]: {attr: 'value'}});

      expect(removePristine({}, 'attr2', 'newValue2')).toEqual({});
    });
  });
};

describe('default', () => test('pristine'));

describe('with custom key', () => test('pKey', 'pKey'));
