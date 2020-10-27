import {renderHook} from 'testUtils';
import usePrevious from './index';

it('returns always the previous value', () => {
  const {result, rerender} = renderHook(value => usePrevious(value), {
    initialProps: 'first',
  });
  expect(result.current).toBeUndefined();

  rerender('prev');
  expect(result.current).toBe('first');

  rerender('next');
  expect(result.current).toBe('prev');
});

it('returns multiple previous values', () => {
  const {result, rerender} = renderHook(values => usePrevious(...values), {
    initialProps: ['first', 'second'],
  });
  expect(result.current).toEqual([undefined, undefined]);

  rerender(['prevFirst', 'prevSecond']);
  expect(result.current).toEqual(['first', 'second']);

  rerender(['first', 'second']);
  expect(result.current).toEqual(['prevFirst', 'prevSecond']);
});
