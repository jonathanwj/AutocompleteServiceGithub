export function stringToArray(str: string) {
  let arr = str.split(" ");
  arr = arr.filter(word => {
    if (word !== "") {
      return true;
    } else {
      return false;
    }
  });
  return arr;
}
