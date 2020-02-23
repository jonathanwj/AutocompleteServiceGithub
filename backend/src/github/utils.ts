export function isArrayOfItems(x: any): x is object[] {
  if (!Array.isArray(x)) {
    return false;
  }
  x.forEach(obj => {
    if (typeof obj !== "object") return false;
  });
  return true;
}

