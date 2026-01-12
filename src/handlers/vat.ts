/**
 * VAT Handlers
 */

import { ApiResponse } from "../types.js";
import { makeRequest } from "../http-client.js";

export async function handleListVatConfigurations(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  return makeRequest("/rest/vat", {
    query: {
      page: args.page as number,
      itemsPerPage: args.itemsPerPage as number,
    },
  });
}
