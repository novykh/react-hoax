import createReducer from "./createReducer";

it("creates a reducer and accepts actions", () => {
  const update = jest.fn().mockImplementation((state, action) => {
    state += action.value;
    return state;
  });

  const reducer = createReducer({
    UPDATE: update,
  });
  expect(reducer(0, { type: "UPDATE", value: 4 })).toBe(4);
  expect(update).toHaveBeenCalled();
  update.mockClear();

  expect(reducer(10, { type: "MISSING_ACTION", value: 4 })).toBe(10);
  expect(update).not.toHaveBeenCalled();

  expect(reducer(10, { type: "UPDATE", value: 4 })).toBe(14);
  expect(update).toHaveBeenCalled();
});
