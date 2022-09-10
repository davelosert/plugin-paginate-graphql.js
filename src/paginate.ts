import { Octokit } from "@octokit/core";
import { mergeResponsesAt } from "./merge-responses";
import { createIterator } from "./iterator";
import { extractPaginationPath } from "./extract-pagination-path";

const createPaginate = (octokit: Octokit) => {
  const iterator = createIterator(octokit);

  return async <ResponseType extends object = any>(
    query: string,
    initialParameters: Record<string, any> = {}
  ): Promise<ResponseType> => {
    let mergedResponse: ResponseType = {} as ResponseType;
    const path = extractPaginationPath(query);
    for await (const response of iterator<ResponseType>(
      query,
      initialParameters
    )) {
      mergedResponse = mergeResponsesAt<ResponseType>(
        mergedResponse,
        response,
        path
      );
    }
    return mergedResponse;
  };
};

export { createPaginate };
