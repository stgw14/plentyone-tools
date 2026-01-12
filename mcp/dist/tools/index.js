/**
 * Tools Index - Aggregates all tool definitions
 */
import { authTools } from "./auth.js";
import { contactsTools } from "./contacts.js";
import { itemsTools } from "./items.js";
import { ordersTools } from "./orders.js";
import { stockTools } from "./stock.js";
import { categoriesTools } from "./categories.js";
import { paymentsTools } from "./payments.js";
import { attributesTools } from "./attributes.js";
import { salesPricesTools } from "./salesPrices.js";
import { propertiesTools } from "./properties.js";
import { tagsTools } from "./tags.js";
import { vatTools } from "./vat.js";
import { shippingTools } from "./shipping.js";
import { accountsTools } from "./accounts.js";
import { orderMetaTools } from "./orderMeta.js";
import { countriesTools } from "./countries.js";
import { itemImagesTools } from "./itemImages.js";
// Export individual tool arrays for reference
export { authTools, contactsTools, itemsTools, ordersTools, stockTools, categoriesTools, paymentsTools, attributesTools, salesPricesTools, propertiesTools, tagsTools, vatTools, shippingTools, accountsTools, orderMetaTools, countriesTools, itemImagesTools, };
// Export combined tools array
export const allTools = [
    ...authTools,
    ...contactsTools,
    ...itemsTools,
    ...ordersTools,
    ...stockTools,
    ...categoriesTools,
    ...paymentsTools,
    ...attributesTools,
    ...salesPricesTools,
    ...propertiesTools,
    ...tagsTools,
    ...vatTools,
    ...shippingTools,
    ...accountsTools,
    ...orderMetaTools,
    ...countriesTools,
    ...itemImagesTools,
];
//# sourceMappingURL=index.js.map