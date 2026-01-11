/**
 * Stock Handlers
 */
import { makeRequest } from "../http-client.js";
export async function handleListStock(args) {
    return makeRequest("/rest/stockmanagement/stock", {
        query: {
            page: args.page,
            itemsPerPage: args.itemsPerPage,
            variationId: args.variationId,
            warehouseId: args.warehouseId,
            updatedAtFrom: args.updatedAtFrom,
            updatedAtTo: args.updatedAtTo,
        },
    });
}
export async function handleGetWarehouseStock(args) {
    const warehouseId = args.warehouseId;
    return makeRequest(`/rest/stockmanagement/warehouses/${warehouseId}/stock`, {
        query: {
            page: args.page,
            itemsPerPage: args.itemsPerPage,
            updatedAtFrom: args.updatedAtFrom,
        },
    });
}
export async function handleListWarehouses() {
    return makeRequest("/rest/stockmanagement/warehouses");
}
export async function handleGetWarehouse(args) {
    const warehouseId = args.warehouseId;
    return makeRequest(`/rest/stockmanagement/warehouses/${warehouseId}`);
}
export async function handleListWarehouseLocations(args) {
    const warehouseId = args.warehouseId;
    return makeRequest(`/rest/stockmanagement/warehouses/${warehouseId}/locations`);
}
export async function handleGetStockMovements(args) {
    return makeRequest("/rest/stockmanagement/stock/movements", {
        query: {
            variationId: args.variationId,
            warehouseId: args.warehouseId,
            createdAtFrom: args.createdAtFrom,
            createdAtTo: args.createdAtTo,
        },
    });
}
//# sourceMappingURL=stock.js.map