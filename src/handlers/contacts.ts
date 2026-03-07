/**
 * Contacts Handlers
 */

import { ApiResponse } from "../types.js";
import { makeRequest } from "../http-client.js";

export async function handleListContacts(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  return makeRequest("/rest/accounts/contacts", {
    query: {
      page: args.page as number,
      itemsPerPage: args.itemsPerPage as number,
      with: args.with as string,
      email: args.email as string,
      name: args.name as string,
      contactId: args.contactId as number,
      typeId: args.typeId as number,
      updatedAtFrom: args.updatedAtFrom as string,
    },
  });
}

export async function handleGetContact(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const contactId = args.contactId as number;
  return makeRequest(`/rest/accounts/contacts/${contactId}`, {
    query: {
      with: args.with as string,
    },
  });
}

export async function handleGetContactAddresses(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const contactId = args.contactId as number;
  return makeRequest(`/rest/accounts/contacts/${contactId}/addresses`);
}

export async function handleCreateContactAddress(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const contactId = args.contactId as number;

  const body: Record<string, unknown> = {};
  if (args.name1) body.name1 = args.name1;
  if (args.name2) body.name2 = args.name2;
  if (args.name3) body.name3 = args.name3;
  if (args.address1) body.address1 = args.address1;
  if (args.address2) body.address2 = args.address2;
  if (args.address3) body.address3 = args.address3;
  if (args.postalCode) body.postalCode = args.postalCode;
  if (args.town) body.town = args.town;
  if (args.countryId) body.countryId = args.countryId;
  if (args.typeId) body.typeId = args.typeId;

  return makeRequest(`/rest/accounts/contacts/${contactId}/addresses`, {
    method: "POST",
    body,
  });
}

export async function handleGetContactOrders(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const contactId = args.contactId as number;
  return makeRequest(`/rest/accounts/contacts/${contactId}/orders`);
}
