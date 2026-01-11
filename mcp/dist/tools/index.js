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
// Export individual tool arrays for reference
export { authTools, contactsTools, itemsTools, ordersTools, stockTools, categoriesTools, paymentsTools, };
// Export combined tools array
export const allTools = [
    ...authTools,
    ...contactsTools,
    ...itemsTools,
    ...ordersTools,
    ...stockTools,
    ...categoriesTools,
    ...paymentsTools,
];
//# sourceMappingURL=index.js.map