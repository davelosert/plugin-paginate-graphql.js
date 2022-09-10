import { MissingPageInfo } from "../src/errors";
import { extractPageInfosAt } from "../src/extract-page-info";
import { PageInfo } from "../src/page-info";

describe("extractPageInfos()", (): void => {
  it("throws if no pageInfo object exists", async (): Promise<void> => {
    expect(() =>
      extractPageInfosAt({ test: { nested: "value" } }, ["test", "nested"])
    ).toThrowError(MissingPageInfo);
  });

  it("throws if path does not exist at all", async (): Promise<void> => {
    expect(() =>
      extractPageInfosAt({ test: { nested: "value" } }, ["other", "path"])
    ).toThrowError(MissingPageInfo);
  });

  it("returns pageInfo with their path if exists", () => {
    const queryResult = {
      data: {
        repository: {
          issues: {
            nodes: [{ id: "1" }],
            pageInfo: { hasNextPage: true, endCursor: "endCursor" },
          },
        },
      },
    };

    expect(
      extractPageInfosAt(queryResult, ["data", "repository", "issues"])
    ).toEqual<PageInfo>({ hasNextPage: true, endCursor: "endCursor" });
  });

  it("returns only first found pageInfo.", async (): Promise<void> => {
    const queryResult = {
      data: {
        repository: {
          issues: {
            nodes: [{ id: "1" }],
            pageInfo: { hasNextPage: true, endCursor: "endCursor1" },
          },
          labels: {
            nodes: [{ id: "2" }],
            pageInfo: { hasNextPage: true, endCursor: "endCursor2" },
          },
        },
      },
    };

    expect(
      extractPageInfosAt(queryResult, ["data", "repository", "issues"])
    ).toEqual<PageInfo>({ hasNextPage: true, endCursor: "endCursor1" });
  });

  it("correctly returns null-cursors.", async (): Promise<void> => {
    const queryResult = {
      data: {
        repository: {
          issues: {
            nodes: [],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    };

    expect(
      extractPageInfosAt(queryResult, ["data", "repository", "issues"])
    ).toEqual<PageInfo>({ hasNextPage: false, endCursor: null });
  });
});
