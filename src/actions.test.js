import { testFunctionAction, testObjectAction } from "testHelpers";
import * as actions from "./actions";
import * as actionTypes from "./actionTypes";

it("initializes", () =>
  testFunctionAction(actions.initialize, { foo: "bar" })({
    expectedType: actionTypes.initialize,
    expectedValues: { values: { foo: "bar" } }
  }));

it("updates", () =>
  testFunctionAction(actions.update, "foo", "bar")({
    expectedType: actionTypes.update,
    expectedValues: { attr: "foo", value: "bar" }
  }));

it("batch updates", () =>
  testFunctionAction(actions.updateBatch, [])({
    expectedType: actionTypes.updateBatch,
    expectedValues: { values: [] }
  }));

it("updates on change - event", () =>
  testFunctionAction(actions.updateOnChange, {
    target: { name: "foo", value: "bar" }
  })({
    expectedType: actionTypes.update,
    expectedValues: { attr: "foo", value: "bar" }
  }));

it("resets", () =>
  testObjectAction(actions.reset)({
    expectedType: actionTypes.reset,
    expectedValues: undefined
  }));

it("resets pristine", () =>
  testObjectAction(actions.resetPristine)({
    expectedType: actionTypes.resetPristine,
    expectedValues: undefined
  }));

it("resetPristineKey", () =>
  testFunctionAction(actions.resetPristineKey, "someKey")({
    expectedType: actionTypes.resetPristineKey,
    expectedValues: { attr: "someKey" }
  }));

it("fetches", () =>
  testObjectAction(actions.startFetch)({
    expectedType: actionTypes.startFetch,
    expectedValues: undefined
  }));

it("success fetches", () =>
  testFunctionAction(actions.doneFetch, { foo: "foo", bar: "bar" })({
    expectedType: actionTypes.doneFetch,
    expectedValues: { values: { foo: "foo", bar: "bar" } }
  }));

it("fail fetches", () =>
  testFunctionAction(actions.failFetch, { foo: "foo", bar: "bar" })({
    expectedType: actionTypes.failFetch,
    expectedValues: { foo: "foo", bar: "bar" }
  }));

it("starts process", () =>
  testObjectAction(actions.startProcess)({
    expectedType: actionTypes.startProcess,
    expectedValues: undefined
  }));

it("finishes process", () =>
  testObjectAction(actions.doneProcess)({
    expectedType: actionTypes.doneProcess,
    expectedValues: undefined
  }));
