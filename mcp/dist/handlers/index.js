/**
 * Handlers Index - Aggregates all handlers and provides the main handleToolCall function
 */
// Auth handlers
import { handleLogin, handleLogout, handleRefreshToken, handleGetAuthorizedUser, } from "./auth.js";
// Contacts handlers
import { handleListContacts, handleGetContact, handleGetContactAddresses, handleCreateContactAddress, handleGetContactOrders, } from "./contacts.js";
// Items handlers
import { handleSearchItems, handleGetItem, handleListVariations, handleGetVariation, handleListBarcodes, } from "./items.js";
// Orders handlers
import { handleSearchOrders, handleGetOrder, handleGetOrderItems, handleGetOrderAddresses, handleGetOrderDocuments, handleGetOrderShipping, } from "./orders.js";
// Stock handlers
import { handleListStock, handleGetWarehouseStock, handleListWarehouses, handleGetWarehouse, handleListWarehouseLocations, handleGetStockMovements, } from "./stock.js";
// Categories handlers
import { handleListCategories, handleGetCategory, handleGetCategoryBranch, } from "./categories.js";
// Payments handlers
import { handleListPayments, handleGetPayment, handleListPaymentMethods, handleGetPaymentProperties, } from "./payments.js";
// Attributes handlers
import { handleListAttributes, handleGetAttribute, handleListAttributeValues, } from "./attributes.js";
// Sales Prices handlers
import { handleListSalesPrices, handleGetSalesPrice, } from "./salesPrices.js";
// Properties handlers
import { handleListProperties, handleGetProperty, handleListPropertyGroups, } from "./properties.js";
// Tags handlers
import { handleListTags, handleGetTag } from "./tags.js";
// VAT handlers
import { handleListVatConfigurations } from "./vat.js";
// Shipping handlers
import { handleListShippingProfiles } from "./shipping.js";
// Accounts handlers
import { handleListAccounts, handleGetAccount, handleListContactClasses, handleListContactTypes, } from "./accounts.js";
// Order Meta handlers
import { handleListOrderStatuses, handleListOrderReferrers, } from "./orderMeta.js";
// Countries handlers
import { handleListCountries } from "./countries.js";
// Item Images handlers
import { handleListItemImages } from "./itemImages.js";
/**
 * Main tool call dispatcher
 */
export async function handleToolCall(name, args) {
    let result;
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
        // --- Attributes ---
        case "plenty_list_attributes":
            result = await handleListAttributes(args);
            break;
        case "plenty_get_attribute":
            result = await handleGetAttribute(args);
            break;
        case "plenty_list_attribute_values":
            result = await handleListAttributeValues(args);
            break;
        // --- Sales Prices ---
        case "plenty_list_sales_prices":
            result = await handleListSalesPrices(args);
            break;
        case "plenty_get_sales_price":
            result = await handleGetSalesPrice(args);
            break;
        // --- Properties ---
        case "plenty_list_properties":
            result = await handleListProperties(args);
            break;
        case "plenty_get_property":
            result = await handleGetProperty(args);
            break;
        case "plenty_list_property_groups":
            result = await handleListPropertyGroups(args);
            break;
        // --- Tags ---
        case "plenty_list_tags":
            result = await handleListTags(args);
            break;
        case "plenty_get_tag":
            result = await handleGetTag(args);
            break;
        // --- VAT ---
        case "plenty_list_vat_configurations":
            result = await handleListVatConfigurations(args);
            break;
        // --- Shipping ---
        case "plenty_list_shipping_profiles":
            result = await handleListShippingProfiles(args);
            break;
        // --- Accounts ---
        case "plenty_list_accounts":
            result = await handleListAccounts(args);
            break;
        case "plenty_get_account":
            result = await handleGetAccount(args);
            break;
        case "plenty_list_contact_classes":
            result = await handleListContactClasses();
            break;
        case "plenty_list_contact_types":
            result = await handleListContactTypes();
            break;
        // --- Order Meta ---
        case "plenty_list_order_statuses":
            result = await handleListOrderStatuses(args);
            break;
        case "plenty_list_order_referrers":
            result = await handleListOrderReferrers();
            break;
        // --- Countries ---
        case "plenty_list_countries":
            result = await handleListCountries(args);
            break;
        // --- Item Images ---
        case "plenty_list_item_images":
            result = await handleListItemImages(args);
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
//# sourceMappingURL=index.js.map