/**
 * Categories Handlers
 */
import { makeRequest } from "../http-client.js";
export async function handleListCategories(args) {
    return makeRequest("/rest/categories", {
        query: {
            page: args.page,
            itemsPerPage: args.itemsPerPage,
            with: args.with,
            lang: args.lang,
            type: args.type,
            parentId: args.parentId,
            plentyId: args.plentyId,
            name: args.name,
            level: args.level,
        },
    });
}
export async function handleGetCategory(args) {
    const categoryId = args.categoryId;
    return makeRequest(`/rest/categories/${categoryId}`, {
        query: {
            with: args.with,
        },
    });
}
export async function handleGetCategoryBranch(args) {
    const categoryId = args.categoryId;
    return makeRequest(`/rest/category_branches/${categoryId}`);
}
//# sourceMappingURL=categories.js.map