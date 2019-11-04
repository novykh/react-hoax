import { render } from "@testing-library/react";
import React from "react";
import useContextSelector from "../../src/useContextSelector";

const WithContext = ({ ctx }) => (
  <div>{JSON.stringify(useContextSelector(ctx))}</div>
);

export const renderContext = ctx => render(<WithContext ctx={ctx} />);
