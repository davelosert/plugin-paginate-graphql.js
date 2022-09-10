/**
 * The interfaces of the "get" and "set" functions are equal to those of lodash:
 * https://lodash.com/docs/4.17.15#get
 * https://lodash.com/docs/4.17.15#set
 *
 * They are cut down to our purposes, but could be replaced by the lodash calls
 * if we ever want to have that dependency.
 */
const get = (object: any, path: string[]) => {
  return path.reduce((current, nextProperty) => current[nextProperty], object);
};

type Mutator = any | ((value: unknown) => any);

const set = (object: any, path: string[], mutator: Mutator) => {
  const lastProperty = path[path.length - 1];
  const parentPath = [...path].slice(0, -1);
  const parent = get(object, parentPath);

  if (typeof mutator === "function") {
    parent[lastProperty!] = mutator(parent[lastProperty!]);
  } else {
    parent[lastProperty!] = mutator;
  }
};

export { get, set };
