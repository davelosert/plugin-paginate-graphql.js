import { MissingCursorVariable } from "../src/errors";
import { extractPaginationPath } from "../src/extract-pagination-path";
describe("extractPaginationPath", (): void => {
  it("gets cursor path from normal query.", async (): Promise<void> => {
    const query = `
      query paginate ($cursor_repository_issues: String) {
        repository(owner: "octokit", name: "rest.js") {
          issues(first: 10, after: $cursor_repository_issues) {
            nodes {
              title
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `;

    const paginationPath = extractPaginationPath(query);

    expect(paginationPath).toEqual(["repository", "issues"]);
  });

  it("gets cursor path from query with space before ': String'.", async (): Promise<void> => {
    const query = `
      query paginate ($cursor_repository_issues : String) {
        repository(owner: "octokit", name: "rest.js") {
          issues(first: 10, after: $cursor_repository_issues) {
            nodes {
              title
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `;

    const paginationPath = extractPaginationPath(query);

    expect(paginationPath).toEqual(["repository", "issues"]);
  });

  it("throws if no cursor can be found in query.", async (): Promise<void> => {
    const query = `
      query paginate ($mistypedCursor: String) {
        repository(owner: "octokit", name: "rest.js") {
          issues(first: 10, after: $mistypedCursor) {
            nodes {
              title
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `;

    try {
      extractPaginationPath(query);
      throw new Error("Should not succeed!");
    } catch (error: any) {
      expect(error).toBeInstanceOf(MissingCursorVariable);
      expect(error.message).toContain(query);
    }
  });

  it("throws if cursor is $cursor_.", async (): Promise<void> => {
    const query = `
      query paginate ($cursor_:String) {
        repository(owner: "octokit", name: "rest.js") {
          issues(first: 10, after: $mistypedCursor) {
            nodes {
              title
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `;

    expect(() => extractPaginationPath(query)).toThrowError(
      MissingCursorVariable
    );
  });

  it("throws if cursor is only $cursor.", async (): Promise<void> => {
    const query = `
      query paginate ($cursor:String) {
        repository(owner: "octokit", name: "rest.js") {
          issues(first: 10, after: $mistypedCursor) {
            nodes {
              title
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `;

    expect(() => extractPaginationPath(query)).toThrowError(
      MissingCursorVariable
    );
  });
});
