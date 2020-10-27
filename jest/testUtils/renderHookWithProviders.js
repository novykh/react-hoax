import {renderHook} from '@testing-library/react-hooks';
import makeProviders from './makeProviders';

export const renderHookWithProviders = (hook, options = {}) => {
  const {ChildrenWrapper, ...rest} = options;
  return renderHook(hook, {
    wrapper: makeProviders({ChildrenWrapper}),
    ...rest,
  });
};
