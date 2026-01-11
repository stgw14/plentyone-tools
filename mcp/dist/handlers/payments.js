/**
 * Payments Handlers
 */
import { makeRequest } from "../http-client.js";
export async function handleListPayments(args) {
    return makeRequest("/rest/payments", {
        query: {
            page: args.page,
            itemsPerPage: args.itemsPerPage,
            orderId: args.orderId,
            transactionType: args.transactionType,
            createdAtFrom: args.createdAtFrom,
            createdAtTo: args.createdAtTo,
        },
    });
}
export async function handleGetPayment(args) {
    const paymentId = args.paymentId;
    return makeRequest(`/rest/payments/${paymentId}`);
}
export async function handleListPaymentMethods() {
    return makeRequest("/rest/payments/methods");
}
export async function handleGetPaymentProperties(args) {
    const paymentId = args.paymentId;
    return makeRequest(`/rest/payments/${paymentId}/properties`);
}
//# sourceMappingURL=payments.js.map