export const isNil = (h: any): boolean => h === null || h === undefined;

export const identity = <T extends any>(h: T): T => h;

export const isEqual = (a: any, b: any): boolean => {
  if (a === b) return true;

  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  )
    return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(b);

  return !keysA.some(key => {
    if (!bHasOwnProperty(key)) return true;
    if (a[key] === b[key]) return false;

    return !isEqual(a[key], b[key]);
  });
};
