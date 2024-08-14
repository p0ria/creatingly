export function isObj(x: any): boolean {
  return typeof x === 'object' && !Array.isArray(x) && x !== null;
}

export function lowercaseFirstLetter(str: string) {
  return `${str.charAt(0).toLowerCase()}${str.substring(1)}`;
}
