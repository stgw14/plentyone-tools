/**
 * Categories Handlers
 */

import { ApiResponse } from "../types.js";
import { makeRequest } from "../http-client.js";

export async function handleListCategories(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  return makeRequest("/rest/categories", {
    query: {
      page: args.page as number,
      itemsPerPage: args.itemsPerPage as number,
      with: args.with as string,
      lang: args.lang as string,
      type: args.type as string,
      parentId: args.parentId as number,
      plentyId: args.plentyId as number,
      name: args.name as string,
      level: args.level as number,
    },
  });
}

export async function handleGetCategory(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const categoryId = args.categoryId as number;
  return makeRequest(`/rest/categories/${categoryId}`, {
    query: {
      with: args.with as string,
    },
  });
}

export async function handleGetCategoryBranch(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const categoryId = args.categoryId as number;
  return makeRequest(`/rest/category_branches/${categoryId}`);
}
