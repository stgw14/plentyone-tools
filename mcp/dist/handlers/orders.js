/**
 * Orders Handlers
 */
import { makeRequest } from "../http-client.js";
export async function handleSearchOrders(args) {
    return makeRequest("/rest/orders", {
        query: {
            page: args.page,
            itemsPerPage: args.itemsPerPage,
            with: args.with,
            statusFrom: args.statusFrom,
            statusTo: args.statusTo,
            createdAtFrom: args.createdAtFrom,
            createdAtTo: args.createdAtTo,
            plentyId: args.plentyId,
        },
    });
}
export async function handleGetOrder(args) {
    const orderId = args.orderId;
    return makeRequest(`/rest/orders/${orderId}`, {
        query: {
            with: args.with,
        },
    });
}
export async function handleGetOrderItems(args) {
    const orderId = args.orderId;
    return makeRequest(`/rest/orders/${orderId}/items`);
}
export async function handleGetOrderAddresses(args) {
    const orderId = args.orderId;
    return makeRequest(`/rest/orders/${orderId}/addresses`);
}
export async function handleGetOrderDocuments(args) {
    const orderId = args.orderId;
    return makeRequest(`/rest/orders/${orderId}/documents`);
}
export async function handleGetOrderShipping(args) {
    const orderId = args.orderId;
    return makeRequest(`/rest/orders/${orderId}/shipping/packages`);
}
//# sourceMappingURL=orders.js.map