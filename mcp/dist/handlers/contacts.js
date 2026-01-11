/**
 * Contacts Handlers
 */
import { makeRequest } from "../http-client.js";
export async function handleListContacts(args) {
    return makeRequest("/rest/accounts/contacts", {
        query: {
            page: args.page,
            itemsPerPage: args.itemsPerPage,
            with: args.with,
            email: args.email,
            name: args.name,
            contactId: args.contactId,
            typeId: args.typeId,
            updatedAtFrom: args.updatedAtFrom,
        },
    });
}
export async function handleGetContact(args) {
    const contactId = args.contactId;
    return makeRequest(`/rest/accounts/contacts/${contactId}`, {
        query: {
            with: args.with,
        },
    });
}
export async function handleGetContactAddresses(args) {
    const contactId = args.contactId;
    return makeRequest(`/rest/accounts/contacts/${contactId}/addresses`);
}
export async function handleCreateContactAddress(args) {
    const contactId = args.contactId;
    const body = {};
    if (args.name1)
        body.name1 = args.name1;
    if (args.name2)
        body.name2 = args.name2;
    if (args.name3)
        body.name3 = args.name3;
    if (args.address1)
        body.address1 = args.address1;
    if (args.address2)
        body.address2 = args.address2;
    if (args.address3)
        body.address3 = args.address3;
    if (args.postalCode)
        body.postalCode = args.postalCode;
    if (args.town)
        body.town = args.town;
    if (args.countryId)
        body.countryId = args.countryId;
    if (args.typeId)
        body.typeId = args.typeId;
    return makeRequest(`/rest/accounts/contacts/${contactId}/addresses`, {
        method: "POST",
        body,
    });
}
export async function handleGetContactOrders(args) {
    const contactId = args.contactId;
    return makeRequest(`/rest/accounts/contacts/${contactId}/orders`);
}
//# sourceMappingURL=contacts.js.map