/**
 * Handlers Index - Aggregates all handlers and provides the main handleToolCall function
 */

import { ApiResponse } from "../types.js";

// Auth handlers
import {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleGetAuthorizedUser,
} from "./auth.js";

// Contacts handlers
import {
  handleListContacts,
  handleGetContact,
  handleGetContactAddresses,
  handleCreateContactAddress,
  handleGetContactOrders,
} from "./contacts.js";

// Items handlers
import {
  handleSearchItems,
  handleGetItem,
  handleListVariations,
  handleGetVariation,
  handleListBarcodes,
} from "./items.js";

// Orders handlers
import {
  handleSearchOrders,
  handleGetOrder,
  handleGetOrderItems,
  handleGetOrderAddresses,
  handleGetOrderDocuments,
  handleGetOrderShipping,
} from "./orders.js";

// Stock handlers
import {
  handleListStock,
  handleGetWarehouseStock,
  handleListWarehouses,
  handleGetWarehouse,
  handleListWarehouseLocations,
  handleGetStockMovements,
} from "./stock.js";

// Categories handlers
import {
  handleListCategories,
  handleGetCategory,
  handleGetCategoryBranch,
} from "./categories.js";

// Payments handlers
import {
  handleListPayments,
  handleGetPayment,
  handleListPaymentMethods,
  handleGetPaymentProperties,
} from "./payments.js";

/**
 * Main tool call dispatcher
 */
export async function handleToolCall(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  let result: ApiResponse;

  switch (name) {
    // --- Authentication ---
    case "plenty_login":
      result = await handleLogin(args);
      break;

    case "plenty_logout":
      result = await handleLogout();
      break;

    case "plenty_refresh_token":
      result = await handleRefreshToken();
      break;

    case "plenty_get_authorized_user":
      result = await handleGetAuthorizedUser();
      break;

    // --- Contacts ---
    case "plenty_list_contacts":
      result = await handleListContacts(args);
      break;

    case "plenty_get_contact":
      result = await handleGetContact(args);
      break;

    case "plenty_get_contact_addresses":
      result = await handleGetContactAddresses(args);
      break;

    case "plenty_create_contact_address":
      result = await handleCreateContactAddress(args);
      break;

    case "plenty_get_contact_orders":
      result = await handleGetContactOrders(args);
      break;

    // --- Items ---
    case "plenty_search_items":
      result = await handleSearchItems(args);
      break;

    case "plenty_get_item":
      result = await handleGetItem(args);
      break;

    case "plenty_list_variations":
      result = await handleListVariations(args);
      break;

    case "plenty_get_variation":
      result = await handleGetVariation(args);
      break;

    case "plenty_list_barcodes":
      result = await handleListBarcodes();
      break;

    // --- Orders ---
    case "plenty_search_orders":
      result = await handleSearchOrders(args);
      break;

    case "plenty_get_order":
      result = await handleGetOrder(args);
      break;

    case "plenty_get_order_items":
      result = await handleGetOrderItems(args);
      break;

    case "plenty_get_order_addresses":
      result = await handleGetOrderAddresses(args);
      break;

    case "plenty_get_order_documents":
      result = await handleGetOrderDocuments(args);
      break;

    case "plenty_get_order_shipping":
      result = await handleGetOrderShipping(args);
      break;

    // --- Stock ---
    case "plenty_list_stock":
      result = await handleListStock(args);
      break;

    case "plenty_get_warehouse_stock":
      result = await handleGetWarehouseStock(args);
      break;

    case "plenty_list_warehouses":
      result = await handleListWarehouses();
      break;

    case "plenty_get_warehouse":
      result = await handleGetWarehouse(args);
      break;

    case "plenty_list_warehouse_locations":
      result = await handleListWarehouseLocations(args);
      break;

    case "plenty_get_stock_movements":
      result = await handleGetStockMovements(args);
      break;

    // --- Categories ---
    case "plenty_list_categories":
      result = await handleListCategories(args);
      break;

    case "plenty_get_category":
      result = await handleGetCategory(args);
      break;

    case "plenty_get_category_branch":
      result = await handleGetCategoryBranch(args);
      break;

    // --- Payments ---
    case "plenty_list_payments":
      result = await handleListPayments(args);
      break;

    case "plenty_get_payment":
      result = await handleGetPayment(args);
      break;

    case "plenty_list_payment_methods":
      result = await handleListPaymentMethods();
      break;

    case "plenty_get_payment_properties":
      result = await handleGetPaymentProperties(args);
      break;

    default:
      result = {
        success: false,
        error: {
          code: "UNKNOWN_TOOL",
          message: `Unknown tool: ${name}`,
        },
      };
  }

  return JSON.stringify(result, null, 2);
}
