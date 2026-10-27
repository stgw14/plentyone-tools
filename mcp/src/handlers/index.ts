import {
  login,
  refreshAccessToken,
  resetToken,
  apiRequest,
} from "../core/client.js";

export async function handleToolCall(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    // --- Authentication ---
    case "plenty_login":
      await login();
      return { success: true, message: "Login successful" };

    case "plenty_logout":
      resetToken();
      return { success: true, message: "Logout successful" };

    case "plenty_refresh_token":
      await refreshAccessToken();
      return { success: true, message: "Token refreshed" };

    case "plenty_get_authorized_user":
      return apiRequest("GET", "/rest/authorized_user");

    // --- Contacts ---
    case "plenty_list_contacts":
      return apiRequest("GET", "/rest/accounts/contacts", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
        name: args.name as string,
        email: args.email as string,
        contactType: args.contactType as number,
        countryId: args.countryId as number,
      });

    case "plenty_get_contact":
      return apiRequest("GET", `/rest/accounts/contacts/${args.contactId}`);

    case "plenty_get_contact_addresses":
      return apiRequest(
        "GET",
        `/rest/accounts/contacts/${args.contactId}/addresses`
      );

    case "plenty_get_contact_orders":
      return apiRequest(
        "GET",
        `/rest/orders/contacts/${args.contactId}`,
        undefined,
        {
          page: args.page as number,
          itemsPerPage: args.itemsPerPage as number,
        }
      );

    // --- Items ---
    case "plenty_search_items":
      return apiRequest("GET", "/rest/items", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
        name: args.name as string,
        flagOne: args.flagOne as number,
        flagTwo: args.flagTwo as number,
      });

    case "plenty_get_item":
      return apiRequest("GET", `/rest/items/${args.itemId}`);

    case "plenty_list_variations":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations`,
        undefined,
        {
          page: args.page as number,
          itemsPerPage: args.itemsPerPage as number,
          isActive: args.isActive as boolean,
        }
      );

    case "plenty_get_variation":
      return apiRequest("GET", `/rest/items/${args.itemId}/variations/${args.variationId}`);

    case "plenty_list_barcodes":
      return apiRequest("GET", "/rest/items/barcodes");

    case "plenty_list_variation_barcodes":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations/${args.variationId}/variation_barcodes`
      );

    // --- Orders ---
    case "plenty_search_orders":
      return apiRequest("GET", "/rest/orders", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
        statusFrom: args.statusFrom as number,
        statusTo: args.statusTo as number,
        orderType: args.orderType as string,
        contactId: args.contactId as number,
        referrerId: args.referrerId as number,
        createdAtFrom: args.createdAtFrom as string,
        createdAtTo: args.createdAtTo as string,
      });

    case "plenty_get_order":
      return apiRequest("GET", `/rest/orders/${args.orderId}`);

    case "plenty_get_order_items":
      return apiRequest("GET", `/rest/orders/${args.orderId}/items`);

    case "plenty_get_order_addresses":
      return apiRequest("GET", `/rest/orders/${args.orderId}/addresses/${args.relationTypeId}`);

    case "plenty_get_order_documents":
      return apiRequest("GET", `/rest/orders/${args.orderId}/documents`);

    case "plenty_get_order_shipping":
      return apiRequest(
        "GET",
        `/rest/orders/${args.orderId}/shipping/packages`
      );

    // --- Stock ---
    case "plenty_list_stock":
      return apiRequest("GET", "/rest/stockmanagement/stock", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
        variationId: args.variationId as number,
        warehouseId: args.warehouseId as number,
      });

    case "plenty_get_warehouse_stock":
      return apiRequest(
        "GET",
        `/rest/stockmanagement/warehouses/${args.warehouseId}/stock`,
        undefined,
        {
          page: args.page as number,
          itemsPerPage: args.itemsPerPage as number,
        }
      );

    case "plenty_list_warehouses":
      return apiRequest("GET", "/rest/stockmanagement/warehouses");

    case "plenty_get_warehouse":
      return apiRequest(
        "GET",
        `/rest/stockmanagement/warehouses/${args.warehouseId}`
      );

    // --- Categories ---
    case "plenty_list_categories":
      return apiRequest("GET", "/rest/categories", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
        parentId: args.parentId as number,
        type: args.type as string,
        lang: args.lang as string,
      });

    case "plenty_get_category":
      return apiRequest("GET", `/rest/categories/${args.categoryId}`, undefined, {
        lang: args.lang as string,
      });

    case "plenty_get_category_branch":
      return apiRequest("GET", `/rest/category_branches/${args.categoryId}`);

    // --- Payments ---
    case "plenty_list_payments":
      return apiRequest("GET", "/rest/payments", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
        orderId: args.orderId as number,
        paymentMethodId: args.paymentMethodId as number,
      });

    case "plenty_get_payment":
      return apiRequest("GET", `/rest/payments/${args.paymentId}`);

    case "plenty_list_payment_methods":
      return apiRequest("GET", "/rest/payments/methods", undefined, {
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_get_payment_properties":
      return apiRequest("GET", `/rest/payments/${args.paymentId}/properties`);

    // --- Attributes ---
    case "plenty_list_attributes":
      return apiRequest("GET", "/rest/items/attributes", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_get_attribute":
      return apiRequest("GET", `/rest/items/attributes/${args.attributeId}`);

    case "plenty_list_attribute_values":
      return apiRequest(
        "GET",
        `/rest/items/attributes/${args.attributeId}/values`
      );

    case "plenty_get_attribute_names":
      return apiRequest(
        "GET",
        `/rest/items/attributes/${args.attributeId}/names`
      );

    case "plenty_get_attribute_value_names":
      return apiRequest(
        "GET",
        `/rest/items/attribute_values/${args.valueId}/names`
      );

    // --- Sales Prices ---
    case "plenty_list_sales_prices":
      return apiRequest("GET", "/rest/items/sales_prices", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_get_sales_price":
      return apiRequest(
        "GET",
        `/rest/items/sales_prices/${args.salesPriceId}`
      );

    // --- Properties ---
    case "plenty_list_properties":
      return apiRequest("GET", "/rest/items/properties", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_get_property":
      return apiRequest("GET", `/rest/items/properties/${args.propertyId}`);

    case "plenty_list_property_groups":
      return apiRequest("GET", "/rest/items/property_groups", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    // --- Tags ---
    case "plenty_list_tags":
      return apiRequest("GET", "/rest/tags", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_get_tag":
      return apiRequest("GET", `/rest/tags/${args.tagId}`);

    // --- VAT ---
    case "plenty_list_vat_configurations":
      return apiRequest("GET", "/rest/vat", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    // --- Accounts ---
    case "plenty_list_accounts":
      return apiRequest("GET", "/rest/accounts", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_get_account":
      return apiRequest("GET", `/rest/accounts/${args.accountId}`);

    case "plenty_list_contact_classes":
      return apiRequest("GET", "/rest/accounts/contacts/classes");

    case "plenty_list_contact_types":
      return apiRequest("GET", "/rest/accounts/contacts/types");

    // --- Order Meta ---
    case "plenty_list_order_statuses":
      return apiRequest("GET", "/rest/orders/statuses", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_list_order_referrers":
      return apiRequest("GET", "/rest/orders/referrers");

    // --- Countries ---
    case "plenty_list_countries":
      return apiRequest("GET", "/rest/orders/shipping/countries", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
        active: args.active as boolean,
      });

    // --- Item Images ---
    case "plenty_list_item_images":
      return apiRequest("GET", `/rest/items/${args.itemId}/images`);

    // ========================================================================
    // NEW TOOL HANDLERS - Added based on OpenAPI v2 specification
    // ========================================================================

    // --- Variations Extended ---
    case "plenty_search_variations":
      return apiRequest("GET", "/rest/items/variations", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
        id: args.id as number,
        itemId: args.itemId as number,
        isMain: args.isMain as boolean,
        isActive: args.isActive as boolean,
        barcode: args.barcode as string,
        numberExact: args.numberExact as string,
        sku: args.sku as string,
        supplierId: args.supplierId as number,
      });

    case "plenty_get_variation_stock":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations/${args.variationId}/stock`
      );

    case "plenty_list_variation_sales_prices":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations/${args.variationId}/variation_sales_prices`
      );

    case "plenty_list_variation_categories":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations/${args.variationId}/variation_categories`
      );

    case "plenty_list_variation_suppliers":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations/${args.variationId}/variation_suppliers`
      );

    case "plenty_list_variation_warehouses":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations/${args.variationId}/variation_warehouses`
      );

    case "plenty_get_variation_descriptions":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations/${args.variationId}/descriptions`
      );

    // --- Stock Movements ---
    case "plenty_list_variation_stock_movements":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations/${args.variationId}/stock/movements`,
        undefined,
        {
          page: args.page as number,
          itemsPerPage: args.itemsPerPage as number,
        }
      );

    case "plenty_list_warehouse_stock_movements":
      return apiRequest(
        "GET",
        `/rest/stockmanagement/warehouses/${args.warehouseId}/stock/movements`,
        undefined,
        {
          page: args.page as number,
          itemsPerPage: args.itemsPerPage as number,
        }
      );

    // --- Orders Extended ---
    case "plenty_get_order_dates":
      return apiRequest("GET", `/rest/orders/${args.orderId}/dates`);

    case "plenty_get_order_status_history":
      return apiRequest("GET", `/rest/orders/${args.orderId}/status-history`);

    case "plenty_list_shipping_countries":
      return apiRequest("GET", "/rest/orders/shipping/countries");

    // --- Contacts Extended ---
    case "plenty_get_contact_banks":
      return apiRequest(
        "GET",
        `/rest/accounts/contacts/${args.contactId}/banks`
      );

    case "plenty_get_contact_related_data":
      return apiRequest(
        "GET",
        `/rest/accounts/contacts/${args.contactId}/related_data`
      );

    case "plenty_get_contact_order_summary":
      return apiRequest(
        "GET",
        `/rest/accounts/order_summaries/contacts/${args.contactId}`
      );

    // --- Manufacturers ---
    case "plenty_list_manufacturers":
      return apiRequest("GET", "/rest/items/manufacturers", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_get_manufacturer":
      return apiRequest(
        "GET",
        `/rest/items/manufacturers/${args.manufacturerId}`
      );

    // --- Units ---
    case "plenty_list_units":
      return apiRequest("GET", "/rest/items/units", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_get_unit":
      return apiRequest("GET", `/rest/items/units/${args.unitId}`);

    // --- Shipping Profiles ---
    case "plenty_list_shipping_presets":
      return apiRequest("GET", "/rest/orders/shipping/presets", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_list_item_shipping_profiles":
      return apiRequest("GET", "/rest/items/item_shipping_profiles", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
