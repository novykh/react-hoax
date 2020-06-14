import { IfcAction } from "./interfaces";

type Handler = (state: object, action: IfcAction) => object;
type Handlers = { [key: string]: Handler };

export default (handlers: Handlers) => {
  return (state: object, action: IfcAction) => {
    if (handlers.hasOwnProperty(action.type))
      return handlers[action.type](state, action);

    return state;
  };
};
