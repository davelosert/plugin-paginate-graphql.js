import { PageInfo } from "./page-info";
import { get } from "./object-helpers";
import { MissingPageInfo } from "./errors";

const extractPageInfosAt = (
  response: any,
  pageInfoPath: string[]
): PageInfo => {
  let pageInfo;
  try {
    pageInfo = get(response, [...pageInfoPath, "pageInfo"]);
  } catch {}

  if (!pageInfo) {
    throw new MissingPageInfo(response);
  }
  return pageInfo;
};

export { extractPageInfosAt };
