/**
 * Tags Handlers
 */

import { ApiResponse } from "../types.js";
import { makeRequest } from "../http-client.js";

export async function handleListTags(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  return makeRequest("/rest/tags", {
    query: {
      page: args.page as number,
      itemsPerPage: args.itemsPerPage as number,
      with: args.with as string,
      tagName: args.tagName as string,
    },
  });
}

export async function handleGetTag(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const tagId = args.tagId as number;
  return makeRequest(`/rest/tags/${tagId}`, {
    query: {
      with: args.with as string,
    },
  });
}
