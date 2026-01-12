/**
 * Properties Handlers
 */

import { ApiResponse } from "../types.js";
import { makeRequest } from "../http-client.js";

export async function handleListProperties(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  return makeRequest("/rest/properties", {
    query: {
      page: args.page as number,
      itemsPerPage: args.itemsPerPage as number,
      with: args.with as string,
      groupId: args.groupId as number,
    },
  });
}

export async function handleGetProperty(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const propertyId = args.propertyId as number;
  return makeRequest(`/rest/properties/${propertyId}`, {
    query: {
      with: args.with as string,
    },
  });
}

export async function handleListPropertyGroups(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  return makeRequest("/rest/properties/groups", {
    query: {
      page: args.page as number,
      itemsPerPage: args.itemsPerPage as number,
      with: args.with as string,
    },
  });
}
