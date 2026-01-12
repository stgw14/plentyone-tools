/**
 * Countries Handlers
 */

import { ApiResponse } from "../types.js";
import { makeRequest } from "../http-client.js";

export async function handleListCountries(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  return makeRequest("/rest/orders/shipping/countries", {
    query: {
      page: args.page as number,
      itemsPerPage: args.itemsPerPage as number,
      active: args.active as boolean,
    },
  });
}
