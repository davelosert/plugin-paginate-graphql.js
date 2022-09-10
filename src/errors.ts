import { CursorValue } from "./page-info";

// Todo: Add link to explanation
const generateMessage = (path: string[], cursorValue: CursorValue): string =>
  `The cursor at "${path.join(
    ","
  )}" did not change its value "${cursorValue}" after a page transition. Please make sure your that your query is set up correctly - for more info see <tdb.>`;

class MissingCursorChange extends Error {
  override name = "MissingCursorChangeError";

  constructor(readonly path: string[], readonly cursorValue: CursorValue) {
    super(generateMessage(path, cursorValue));

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class MissingPageInfo extends Error {
  override name = "MissingPageInfo";

  constructor(readonly response: any) {
    super(
      `No pageInfo property found in response. Please make sure to specify the pageInfo in your query and to put the path to it into your cursor variable. Response-Data: ${JSON.stringify(
        response,
        null,
        2
      )}`
    );

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class MissingCursorVariable extends Error {
  override name = "MissingCursorVariable";

  constructor(readonly query: any) {
    super(
      `Could not find a valid Cursor Variable in the provided query. Please make sure to pass a Cursor with the path to the paginated resource (e.g. "$cursor_repository_issues"). Provided Query was:\n${query}`
    );

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { MissingCursorChange, MissingPageInfo, MissingCursorVariable };
