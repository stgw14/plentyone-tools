/**
 * Payments Handlers
 */

import { ApiResponse } from "../types.js";
import { makeRequest } from "../http-client.js";

export async function handleListPayments(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  return makeRequest("/rest/payments", {
    query: {
      page: args.page as number,
      itemsPerPage: args.itemsPerPage as number,
      orderId: args.orderId as number,
      transactionType: args.transactionType as number,
      createdAtFrom: args.createdAtFrom as string,
      createdAtTo: args.createdAtTo as string,
    },
  });
}

export async function handleGetPayment(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const paymentId = args.paymentId as number;
  return makeRequest(`/rest/payments/${paymentId}`);
}

export async function handleListPaymentMethods(): Promise<ApiResponse> {
  return makeRequest("/rest/payments/methods");
}

export async function handleGetPaymentProperties(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const paymentId = args.paymentId as number;
  return makeRequest(`/rest/payments/${paymentId}/properties`);
}
