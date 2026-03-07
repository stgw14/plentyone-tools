/**
 * Order Meta Handlers (Statuses, Referrers)
 */

import { ApiResponse } from "../types.js";
import { makeRequest } from "../http-client.js";

export async function handleListOrderStatuses(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  return makeRequest("/rest/orders/statuses", {
    query: {
      page: args.page as number,
      itemsPerPage: args.itemsPerPage as number,
    },
  });
}

export async function handleListOrderReferrers(): Promise<ApiResponse> {
  return makeRequest("/rest/orders/referrers");
}
