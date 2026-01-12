/**
 * Items Handlers
 */

import { ApiResponse } from "../types.js";
import { makeRequest } from "../http-client.js";

export async function handleSearchItems(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  return makeRequest("/rest/items", {
    query: {
      page: args.page as number,
      itemsPerPage: args.itemsPerPage as number,
      with: args.with as string,
      lang: args.lang as string,
      name: args.name as string,
      id: args.id as string,
    },
  });
}

export async function handleGetItem(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const itemId = args.itemId as number;
  return makeRequest(`/rest/items/${itemId}`, {
    query: {
      with: args.with as string,
      lang: args.lang as string,
    },
  });
}

export async function handleListVariations(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const itemId = args.itemId as number;
  return makeRequest(`/rest/items/${itemId}/variations`, {
    query: {
      with: args.with as string,
      lang: args.lang as string,
    },
  });
}

export async function handleGetVariation(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const itemId = args.itemId as number;
  const variationId = args.variationId as number;
  return makeRequest(`/rest/items/${itemId}/variations/${variationId}`, {
    query: {
      with: args.with as string,
      lang: args.lang as string,
    },
  });
}

export async function handleListBarcodes(): Promise<ApiResponse> {
  return makeRequest("/rest/items/barcodes");
}
