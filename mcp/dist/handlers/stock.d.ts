/**
 * Stock Handlers
 */
import { ApiResponse } from "../types.js";
export declare function handleListStock(args: Record<string, unknown>): Promise<ApiResponse>;
export declare function handleGetWarehouseStock(args: Record<string, unknown>): Promise<ApiResponse>;
export declare function handleListWarehouses(): Promise<ApiResponse>;
export declare function handleGetWarehouse(args: Record<string, unknown>): Promise<ApiResponse>;
export declare function handleListWarehouseLocations(args: Record<string, unknown>): Promise<ApiResponse>;
export declare function handleGetStockMovements(args: Record<string, unknown>): Promise<ApiResponse>;
//# sourceMappingURL=stock.d.ts.map