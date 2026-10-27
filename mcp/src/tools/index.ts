import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const tools: Tool[] = [
  // --- Authentication (4) ---
  {
    name: "plenty_login",
    description: "Login to plentyONE and get access token",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "plenty_logout",
    description: "Logout from plentyONE and invalidate token",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "plenty_refresh_token",
    description: "Refresh the access token",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "plenty_get_authorized_user",
    description: "Get information about the currently authenticated user",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },

  // --- Contacts (4) ---
  {
    name: "plenty_list_contacts",
    description: "List contacts with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page (max 250)" },
        name: { type: "string", description: "Filter by name" },
        email: { type: "string", description: "Filter by email" },
        contactType: { type: "number", description: "Filter by contact type ID" },
        countryId: { type: "number", description: "Filter by country ID" },
      },
    },
  },
  {
    name: "plenty_get_contact",
    description: "Get a specific contact by ID",
    inputSchema: {
      type: "object",
      properties: {
        contactId: { type: "number", description: "Contact ID" },
      },
      required: ["contactId"],
    },
  },
  {
    name: "plenty_get_contact_addresses",
    description: "Get addresses for a contact",
    inputSchema: {
      type: "object",
      properties: {
        contactId: { type: "number", description: "Contact ID" },
      },
      required: ["contactId"],
    },
  },
  {
    name: "plenty_get_contact_orders",
    description: "Get orders for a contact",
    inputSchema: {
      type: "object",
      properties: {
        contactId: { type: "number", description: "Contact ID" },
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
      required: ["contactId"],
    },
  },

  // --- Items (5) ---
  {
    name: "plenty_search_items",
    description: "Search items with filters",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
        name: { type: "string", description: "Filter by name" },
        flagOne: { type: "number", description: "Filter by flag 1" },
        flagTwo: { type: "number", description: "Filter by flag 2" },
      },
    },
  },
  {
    name: "plenty_get_item",
    description: "Get a specific item by ID",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
      },
      required: ["itemId"],
    },
  },
  {
    name: "plenty_list_variations",
    description: "List variations for an item",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
        isActive: { type: "boolean", description: "Filter by active status" },
      },
      required: ["itemId"],
    },
  },
  {
    name: "plenty_get_variation",
    description: "Get a specific variation by ID",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
      },
      required: ["itemId", "variationId"],
    },
  },
  {
    name: "plenty_list_barcodes",
    description: "List barcode types (GTIN, UPC, etc.)",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "plenty_list_variation_barcodes",
    description: "List barcodes for a specific variation",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
      },
      required: ["itemId", "variationId"],
    },
  },

  // --- Orders (6) ---
  {
    name: "plenty_search_orders",
    description: "Search orders with filters",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
        statusFrom: { type: "number", description: "Status range start" },
        statusTo: { type: "number", description: "Status range end" },
        orderType: { type: "string", description: "Order type" },
        contactId: { type: "number", description: "Filter by contact ID" },
        referrerId: { type: "number", description: "Filter by referrer ID" },
        createdAtFrom: { type: "string", description: "Created from (ISO date)" },
        createdAtTo: { type: "string", description: "Created to (ISO date)" },
      },
    },
  },
  {
    name: "plenty_get_order",
    description: "Get a specific order by ID",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "number", description: "Order ID" },
      },
      required: ["orderId"],
    },
  },
  {
    name: "plenty_get_order_items",
    description: "Get items for an order",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "number", description: "Order ID" },
      },
      required: ["orderId"],
    },
  },
  {
    name: "plenty_get_order_addresses",
    description: "Get addresses for an order by relation type (1=billing, 2=delivery)",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "number", description: "Order ID" },
        relationTypeId: { type: "number", description: "Address relation type (1=billing, 2=delivery)" },
      },
      required: ["orderId", "relationTypeId"],
    },
  },
  {
    name: "plenty_get_order_documents",
    description: "Get documents for an order",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "number", description: "Order ID" },
      },
      required: ["orderId"],
    },
  },
  {
    name: "plenty_get_order_shipping",
    description: "Get shipping information for an order",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "number", description: "Order ID" },
      },
      required: ["orderId"],
    },
  },

  // --- Stock (4) ---
  {
    name: "plenty_list_stock",
    description: "List stock with filters",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
        variationId: { type: "number", description: "Filter by variation ID" },
        warehouseId: { type: "number", description: "Filter by warehouse ID" },
      },
    },
  },
  {
    name: "plenty_get_warehouse_stock",
    description: "Get stock for a specific warehouse",
    inputSchema: {
      type: "object",
      properties: {
        warehouseId: { type: "number", description: "Warehouse ID" },
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
      required: ["warehouseId"],
    },
  },
  {
    name: "plenty_list_warehouses",
    description: "List all warehouses",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "plenty_get_warehouse",
    description: "Get a specific warehouse by ID",
    inputSchema: {
      type: "object",
      properties: {
        warehouseId: { type: "number", description: "Warehouse ID" },
      },
      required: ["warehouseId"],
    },
  },

  // --- Categories (3) ---
  {
    name: "plenty_list_categories",
    description: "List categories with filters",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
        parentId: { type: "number", description: "Filter by parent category ID" },
        type: { type: "string", description: "Category type (item, container, content, blog)" },
        lang: { type: "string", description: "Language code (e.g., de, en)" },
      },
    },
  },
  {
    name: "plenty_get_category",
    description: "Get a specific category by ID",
    inputSchema: {
      type: "object",
      properties: {
        categoryId: { type: "number", description: "Category ID" },
        lang: { type: "string", description: "Language code" },
      },
      required: ["categoryId"],
    },
  },
  {
    name: "plenty_get_category_branch",
    description: "Get the branch (path from root) for a category",
    inputSchema: {
      type: "object",
      properties: {
        categoryId: { type: "number", description: "Category ID" },
      },
      required: ["categoryId"],
    },
  },

  // --- Payments (4) ---
  {
    name: "plenty_list_payments",
    description: "List payments with filters",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
        orderId: { type: "number", description: "Filter by order ID" },
        paymentMethodId: { type: "number", description: "Filter by payment method ID" },
      },
    },
  },
  {
    name: "plenty_get_payment",
    description: "Get a specific payment by ID",
    inputSchema: {
      type: "object",
      properties: {
        paymentId: { type: "number", description: "Payment ID" },
      },
      required: ["paymentId"],
    },
  },
  {
    name: "plenty_list_payment_methods",
    description: "List all payment methods",
    inputSchema: {
      type: "object",
      properties: {
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_get_payment_properties",
    description: "Get properties for a payment",
    inputSchema: {
      type: "object",
      properties: {
        paymentId: { type: "number", description: "Payment ID" },
      },
      required: ["paymentId"],
    },
  },

  // --- Attributes (3) ---
  {
    name: "plenty_list_attributes",
    description: "List item attributes (e.g., size, color)",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_get_attribute",
    description: "Get a specific attribute by ID",
    inputSchema: {
      type: "object",
      properties: {
        attributeId: { type: "number", description: "Attribute ID" },
      },
      required: ["attributeId"],
    },
  },
  {
    name: "plenty_list_attribute_values",
    description: "List values for an attribute",
    inputSchema: {
      type: "object",
      properties: {
        attributeId: { type: "number", description: "Attribute ID" },
      },
      required: ["attributeId"],
    },
  },
  {
    name: "plenty_get_attribute_names",
    description:
      "Get multilingual names of an attribute (e.g., DE='Farbe', EN='Color'). Returns the official translated names used in the shop frontend.",
    inputSchema: {
      type: "object",
      properties: {
        attributeId: { type: "number", description: "The attribute ID" },
      },
      required: ["attributeId"],
    },
  },
  {
    name: "plenty_get_attribute_value_names",
    description:
      "Get multilingual names of an attribute value (e.g., DE='rosa (015)', EN='candy-pink (015)'). Returns the official translated names, which may differ from the backendName or comment fields.",
    inputSchema: {
      type: "object",
      properties: {
        attributeId: { type: "number", description: "The attribute ID (parent attribute)" },
        valueId: { type: "number", description: "The attribute value ID" },
      },
      required: ["attributeId", "valueId"],
    },
  },

  // --- Sales Prices (2) ---
  {
    name: "plenty_list_sales_prices",
    description: "List sales price configurations",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_get_sales_price",
    description: "Get a specific sales price by ID",
    inputSchema: {
      type: "object",
      properties: {
        salesPriceId: { type: "number", description: "Sales price ID" },
      },
      required: ["salesPriceId"],
    },
  },

  // --- Properties (3) ---
  {
    name: "plenty_list_properties",
    description: "List item properties",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_get_property",
    description: "Get a specific property by ID",
    inputSchema: {
      type: "object",
      properties: {
        propertyId: { type: "number", description: "Property ID" },
      },
      required: ["propertyId"],
    },
  },
  {
    name: "plenty_list_property_groups",
    description: "List property groups",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },

  // --- Tags (2) ---
  {
    name: "plenty_list_tags",
    description: "List tags",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_get_tag",
    description: "Get a specific tag by ID",
    inputSchema: {
      type: "object",
      properties: {
        tagId: { type: "number", description: "Tag ID" },
      },
      required: ["tagId"],
    },
  },

  // --- VAT (1) ---
  {
    name: "plenty_list_vat_configurations",
    description: "List VAT configurations",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },

  // --- Accounts (4) ---
  {
    name: "plenty_list_accounts",
    description: "List accounts (companies)",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_get_account",
    description: "Get a specific account by ID",
    inputSchema: {
      type: "object",
      properties: {
        accountId: { type: "number", description: "Account ID" },
      },
      required: ["accountId"],
    },
  },
  {
    name: "plenty_list_contact_classes",
    description: "List contact classes (customer groups)",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "plenty_list_contact_types",
    description: "List contact types",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },

  // --- Order Meta (2) ---
  {
    name: "plenty_list_order_statuses",
    description: "List order statuses",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_list_order_referrers",
    description: "List order referrers (sales channels)",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },

  // --- Countries (1) ---
  {
    name: "plenty_list_countries",
    description: "List countries",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
        active: { type: "boolean", description: "Filter by active status" },
      },
    },
  },

  // --- Item Images (1) ---
  {
    name: "plenty_list_item_images",
    description: "List images for an item",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
      },
      required: ["itemId"],
    },
  },

  // ============================================================================
  // NEW TOOLS - Added based on OpenAPI v2 specification
  // ============================================================================

  // --- Variations Extended (7) ---
  {
    name: "plenty_search_variations",
    description: "Search variations with filters (global search across all items)",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
        id: { type: "number", description: "Filter by variation ID" },
        itemId: { type: "number", description: "Filter by item ID" },
        isMain: { type: "boolean", description: "Filter main variations only" },
        isActive: { type: "boolean", description: "Filter active variations only" },
        barcode: { type: "string", description: "Filter by barcode" },
        numberExact: { type: "string", description: "Filter by exact variation number" },
        sku: { type: "string", description: "Filter by SKU" },
        supplierId: { type: "number", description: "Filter by supplier ID" },
      },
    },
  },
  {
    name: "plenty_get_variation_stock",
    description: "Get stock of a variation per warehouse",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
      },
      required: ["itemId", "variationId"],
    },
  },
  {
    name: "plenty_list_variation_sales_prices",
    description: "List sales prices linked to a variation",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
      },
      required: ["itemId", "variationId"],
    },
  },
  {
    name: "plenty_list_variation_categories",
    description: "List categories linked to a variation",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
      },
      required: ["itemId", "variationId"],
    },
  },
  {
    name: "plenty_list_variation_suppliers",
    description: "List suppliers for a variation",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
      },
      required: ["itemId", "variationId"],
    },
  },
  {
    name: "plenty_list_variation_warehouses",
    description: "List warehouses linked to a variation",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
      },
      required: ["itemId", "variationId"],
    },
  },
  {
    name: "plenty_get_variation_descriptions",
    description: "Get product texts/descriptions for a variation",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
      },
      required: ["itemId", "variationId"],
    },
  },

  // --- Stock Movements (2) ---
  {
    name: "plenty_list_variation_stock_movements",
    description: "List stock movements for a variation",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
      required: ["itemId", "variationId"],
    },
  },
  {
    name: "plenty_list_warehouse_stock_movements",
    description: "List stock movements for a warehouse",
    inputSchema: {
      type: "object",
      properties: {
        warehouseId: { type: "number", description: "Warehouse ID" },
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
      required: ["warehouseId"],
    },
  },

  // --- Orders Extended (3) ---
  {
    name: "plenty_get_order_dates",
    description: "Get all dates of an order (created, paid, shipped, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "number", description: "Order ID" },
      },
      required: ["orderId"],
    },
  },
  {
    name: "plenty_get_order_status_history",
    description: "Get status change history of an order",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "number", description: "Order ID" },
      },
      required: ["orderId"],
    },
  },
  {
    name: "plenty_list_shipping_countries",
    description: "List shipping countries",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },

  // --- Contacts Extended (3) ---
  {
    name: "plenty_get_contact_banks",
    description: "List bank accounts for a contact",
    inputSchema: {
      type: "object",
      properties: {
        contactId: { type: "number", description: "Contact ID" },
      },
      required: ["contactId"],
    },
  },
  {
    name: "plenty_get_contact_related_data",
    description: "Get related data for a contact (addresses, options, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        contactId: { type: "number", description: "Contact ID" },
      },
      required: ["contactId"],
    },
  },
  {
    name: "plenty_get_contact_order_summary",
    description: "Get order summary for a contact",
    inputSchema: {
      type: "object",
      properties: {
        contactId: { type: "number", description: "Contact ID" },
      },
      required: ["contactId"],
    },
  },

  // --- Manufacturers (2) ---
  {
    name: "plenty_list_manufacturers",
    description: "List manufacturers",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_get_manufacturer",
    description: "Get a manufacturer by ID",
    inputSchema: {
      type: "object",
      properties: {
        manufacturerId: { type: "number", description: "Manufacturer ID" },
      },
      required: ["manufacturerId"],
    },
  },

  // --- Units (2) ---
  {
    name: "plenty_list_units",
    description: "List units (piece, kg, liter, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_get_unit",
    description: "Get a unit by ID",
    inputSchema: {
      type: "object",
      properties: {
        unitId: { type: "number", description: "Unit ID" },
      },
      required: ["unitId"],
    },
  },

  // --- Shipping Profiles (2) ---
  {
    name: "plenty_list_shipping_presets",
    description: "List shipping profiles (presets)",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_list_item_shipping_profiles",
    description: "List shipping profiles linked to items",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
];
