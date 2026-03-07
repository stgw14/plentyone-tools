/**
 * Orders Handlers
 */

import { ApiResponse } from "../types.js";
import { makeRequest } from "../http-client.js";

export async function handleSearchOrders(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  return makeRequest("/rest/orders", {
    query: {
      page: args.page as number,
      itemsPerPage: args.itemsPerPage as number,
      with: args.with as string,
      statusFrom: args.statusFrom as number,
      statusTo: args.statusTo as number,
      createdAtFrom: args.createdAtFrom as string,
      createdAtTo: args.createdAtTo as string,
      plentyId: args.plentyId as number,
    },
  });
}

export async function handleGetOrder(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const orderId = args.orderId as number;
  return makeRequest(`/rest/orders/${orderId}`, {
    query: {
      with: args.with as string,
    },
  });
}

export async function handleGetOrderItems(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const orderId = args.orderId as number;
  return makeRequest(`/rest/orders/${orderId}/items`);
}

export async function handleGetOrderAddresses(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const orderId = args.orderId as number;
  return makeRequest(`/rest/orders/${orderId}/addresses`);
}

export async function handleGetOrderDocuments(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const orderId = args.orderId as number;
  return makeRequest(`/rest/orders/${orderId}/documents`);
}

export async function handleGetOrderShipping(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const orderId = args.orderId as number;
  return makeRequest(`/rest/orders/${orderId}/shipping/packages`);
}
