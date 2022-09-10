import { extractPageInfosAt } from "./extract-page-info";
import { Octokit } from "@octokit/core";
import { getCursorFrom, hasAnotherPage } from "./page-info";
import { MissingCursorChange } from "./errors";
import { extractPaginationPath } from "./extract-pagination-path";

const createIterator = (octokit: Octokit) => {
  return <ResponseType = any>(
    query: string,
    initialParameters: Record<string, any> = {}
  ) => {
    let nextPageExists = true;
    let parameters = { ...initialParameters };

    const pageInfoPath = extractPaginationPath(query);

    return {
      [Symbol.asyncIterator]: () => ({
        async next() {
          if (!nextPageExists) return { done: true, value: {} as ResponseType };

          const response = await octokit.graphql<ResponseType>(
            query,
            parameters
          );

          const pageInfo = extractPageInfosAt(response, pageInfoPath);
          const nextCursorValue = getCursorFrom(pageInfo);
          nextPageExists = hasAnotherPage(pageInfo);

          if (nextPageExists && nextCursorValue === parameters.cursor) {
            throw new MissingCursorChange(pageInfoPath, nextCursorValue);
          }

          parameters = {
            ...parameters,
            cursor: nextCursorValue,
          };

          return { done: false, value: response };
        },
      }),
    };
  };
};

export { createIterator };
