export function isArrayOfItems(x: any): x is object[] {
  if (!Array.isArray(x)) {
    return false;
  }
  x.forEach(obj => {
    if (typeof obj !== "object") return false;
  });
  return true;
}

export function currentTimeInSeconds() {
  return Math.round(Date.now() / 1000);
}
