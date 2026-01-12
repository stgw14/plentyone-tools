/**
 * Shipping Handlers
 */

import { ApiResponse } from "../types.js";
import { makeRequest } from "../http-client.js";

export async function handleListShippingProfiles(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  return makeRequest("/rest/orders/shipping/presets", {
    query: {
      page: args.page as number,
      itemsPerPage: args.itemsPerPage as number,
      with: args.with as string,
    },
  });
}
