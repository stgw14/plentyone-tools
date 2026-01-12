/**
 * Item Images Handlers
 */

import { ApiResponse } from "../types.js";
import { makeRequest } from "../http-client.js";

export async function handleListItemImages(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const itemId = args.itemId as number;
  return makeRequest(`/rest/items/${itemId}/images`, {
    query: {
      with: args.with as string,
    },
  });
}
