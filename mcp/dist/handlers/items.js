/**
 * Items Handlers
 */
import { makeRequest } from "../http-client.js";
export async function handleSearchItems(args) {
    return makeRequest("/rest/items", {
        query: {
            page: args.page,
            itemsPerPage: args.itemsPerPage,
            with: args.with,
            lang: args.lang,
            name: args.name,
            id: args.id,
        },
    });
}
export async function handleGetItem(args) {
    const itemId = args.itemId;
    return makeRequest(`/rest/items/${itemId}`, {
        query: {
            with: args.with,
            lang: args.lang,
        },
    });
}
export async function handleListVariations(args) {
    const itemId = args.itemId;
    return makeRequest(`/rest/items/${itemId}/variations`, {
        query: {
            with: args.with,
            lang: args.lang,
        },
    });
}
export async function handleGetVariation(args) {
    const itemId = args.itemId;
    const variationId = args.variationId;
    return makeRequest(`/rest/items/${itemId}/variations/${variationId}`, {
        query: {
            with: args.with,
            lang: args.lang,
        },
    });
}
export async function handleListBarcodes() {
    return makeRequest("/rest/items/barcodes");
}
//# sourceMappingURL=items.js.map