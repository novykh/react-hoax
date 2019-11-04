import { render, act } from "@testing-library/react";
import makeProviders from "./makeProviders";

export const renderWithProviders = (ui, options = {}) => {
  const { ChildrenWrapper, ...rest } = options;
  const rendered = render(ui, {
    wrapper: makeProviders({ ChildrenWrapper }),
    ...rest
  });
  return rendered;
};
