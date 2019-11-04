import React from 'react';
import {renderWithProviders} from 'testUtils';

export default (children, regex) => Component => () => {
  const {getByText} = renderWithProviders(<Component>{children}</Component>);
  expect(getByText(regex || children)).toMatchSnapshot();
};
