import { MissingCursorVariable } from "./errors";

const cursorRegexp = /\$cursor_[^:|\s]*/;
const extractPaginationPath = (query: string): string[] => {
  const matchedCursor = query.match(cursorRegexp);
  if (!matchedCursor) {
    throw new MissingCursorVariable(query);
  }

  const [_, ...path] = matchedCursor[0].split("_");

  if (path[0] === "") {
    throw new MissingCursorVariable(query);
  }

  return path;
};

export { extractPaginationPath };
