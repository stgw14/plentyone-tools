/**
 * Attributes Handlers
 */

import { ApiResponse } from "../types.js";
import { makeRequest } from "../http-client.js";

export async function handleListAttributes(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  return makeRequest("/rest/items/attributes", {
    query: {
      page: args.page as number,
      itemsPerPage: args.itemsPerPage as number,
      with: args.with as string,
    },
  });
}

export async function handleGetAttribute(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const attributeId = args.attributeId as number;
  return makeRequest(`/rest/items/attributes/${attributeId}`, {
    query: {
      with: args.with as string,
    },
  });
}

export async function handleListAttributeValues(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const attributeId = args.attributeId as number;
  return makeRequest(`/rest/items/attributes/${attributeId}/values`, {
    query: {
      with: args.with as string,
    },
  });
}

export async function handleGetAttributeNames(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const attributeId = args.attributeId as number;
  return makeRequest(`/rest/items/attributes/${attributeId}/names`);
}

export async function handleGetAttributeValueNames(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const valueId = args.valueId as number;
  return makeRequest(`/rest/items/attribute_values/${valueId}/names`);
}
