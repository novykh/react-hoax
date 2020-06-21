import { useRef, useEffect } from "react";

/**
 * @description A hook for keeping the previous state of a value
 * @example
 * const Foo = ({bar}) => {
 *    const previousBarRef = usePrevious(bar);
 *
 *    return (
 *      <Fragment>
 *        it was {previousBarRef.current} and became {bar}
 *        <button onClick={changeBar}>Change bar</button>
 *      </Fragment>
 *    );
 * }
 */

const usePrevious = (value: any) => {
  const valueRef = useRef();

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef.current;
};

export default (value: any, ...rest: any[]) => {
  if (rest.length)
    return rest.reduce((h, val) => [...h, usePrevious(val)], [
      usePrevious(value),
    ]);
  return usePrevious(value);
};
