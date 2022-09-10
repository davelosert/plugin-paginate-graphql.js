import { get, set } from "./object-helpers";

const mergeResponsesAt = <ResponseType extends object = any>(
  response1: ResponseType,
  response2: ResponseType,
  path: string[]
): ResponseType => {
  if (Object.keys(response1).length === 0) {
    return Object.assign(response1, response2);
  }

  const nodesPath = [...path, "nodes"];
  const newNodes = get(response2, nodesPath);
  if (newNodes) {
    set(response1, nodesPath, (values: any) => {
      return [...values, ...newNodes];
    });
  }

  const edgesPath = [...path, "edges"];
  const newEdges = get(response2, edgesPath);
  if (newEdges) {
    set(response1, edgesPath, (values: any) => {
      return [...values, ...newEdges];
    });
  }

  const pageInfoPath = [...path, "pageInfo"];
  set(response1, pageInfoPath, get(response2, pageInfoPath));

  return response1;
};

export { mergeResponsesAt };
