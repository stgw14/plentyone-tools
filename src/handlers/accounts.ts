/**
 * Accounts Handlers
 */

import { ApiResponse } from "../types.js";
import { makeRequest } from "../http-client.js";

export async function handleListAccounts(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  return makeRequest("/rest/accounts", {
    query: {
      page: args.page as number,
      itemsPerPage: args.itemsPerPage as number,
      companyName: args.companyName as string,
    },
  });
}

export async function handleGetAccount(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const accountId = args.accountId as number;
  return makeRequest(`/rest/accounts/${accountId}`);
}

export async function handleListContactClasses(): Promise<ApiResponse> {
  return makeRequest("/rest/accounts/contacts/classes");
}

export async function handleListContactTypes(): Promise<ApiResponse> {
  return makeRequest("/rest/accounts/contacts/types");
}
