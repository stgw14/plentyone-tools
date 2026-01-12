/**
 * Stock Handlers
 */

import { ApiResponse } from "../types.js";
import { makeRequest } from "../http-client.js";

export async function handleListStock(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  return makeRequest("/rest/stockmanagement/stock", {
    query: {
      page: args.page as number,
      itemsPerPage: args.itemsPerPage as number,
      variationId: args.variationId as number,
      warehouseId: args.warehouseId as number,
      updatedAtFrom: args.updatedAtFrom as string,
      updatedAtTo: args.updatedAtTo as string,
    },
  });
}

export async function handleGetWarehouseStock(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const warehouseId = args.warehouseId as number;
  return makeRequest(`/rest/stockmanagement/warehouses/${warehouseId}/stock`, {
    query: {
      page: args.page as number,
      itemsPerPage: args.itemsPerPage as number,
      updatedAtFrom: args.updatedAtFrom as string,
    },
  });
}

export async function handleListWarehouses(): Promise<ApiResponse> {
  return makeRequest("/rest/stockmanagement/warehouses");
}

export async function handleGetWarehouse(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const warehouseId = args.warehouseId as number;
  return makeRequest(`/rest/stockmanagement/warehouses/${warehouseId}`);
}
