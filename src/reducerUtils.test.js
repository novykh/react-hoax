import { updateBatch } from "./reducerUtils";

it("empty", () => {
  let update = jest
    .fn()
    .mockImplementation((h, attr, value) => ({ ...h, [attr]: value }));
  expect(updateBatch(update, {}, {})).toEqual({});
  expect(update).not.toHaveBeenCalled();

  update = jest
    .fn()
    .mockImplementation((h, attr, value) => ({ ...h, [attr]: value }));
  expect(updateBatch(update, {}, [])).toEqual({});
  expect(update).not.toHaveBeenCalled();
});

it("array", () => {
  const update = jest
    .fn()
    .mockImplementation((h, attr, value) => ({ ...h, [attr]: value }));
  expect(
    updateBatch(update, {}, [{ attr: "title", value: "developer" }])
  ).toEqual({ title: "developer" });
  expect(update).toHaveBeenCalledWith({}, "title", "developer");
});

it("object", () => {
  const update = jest
    .fn()
    .mockImplementation((h, attr, value) => ({ ...h, [attr]: value }));
  expect(updateBatch(update, {}, { title: "developer" })).toEqual({
    title: "developer"
  });
  expect(update).toHaveBeenCalledWith({}, "title", "developer");
});
