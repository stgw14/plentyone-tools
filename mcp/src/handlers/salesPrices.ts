/**
 * Sales Prices Handlers
 */

import { ApiResponse } from "../types.js";
import { makeRequest } from "../http-client.js";

export async function handleListSalesPrices(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  return makeRequest("/rest/items/sales_prices", {
    query: {
      page: args.page as number,
      itemsPerPage: args.itemsPerPage as number,
    },
  });
}

export async function handleGetSalesPrice(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const salesPriceId = args.salesPriceId as number;
  return makeRequest(`/rest/items/sales_prices/${salesPriceId}`);
}
