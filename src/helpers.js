export const isNil = h => h === null || h === undefined;

export const identity = h => h;

export const isEqual = (objA, objB) => {
  if (objA === objB) return true;

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  )
    return false;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  return !keysA.some(key => {
    if (!bHasOwnProperty(key)) return true;
    if (objA[key] === objB[key]) return false;

    return !isEqual(objA[key], objB[key]);
  });
};
