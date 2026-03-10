import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We need to test with PII_FILTER_ENABLED=true (default) and =false.
// Since the module reads process.env at import time, we use dynamic imports.

describe('PII Filter (enabled by default)', () => {
  let filterPII: typeof import('../pii-filter.js').filterPII;
  let filterPIIString: typeof import('../pii-filter.js').filterPIIString;
  let isPIIFilterEnabled: typeof import('../pii-filter.js').isPIIFilterEnabled;

  beforeEach(async () => {
    vi.resetModules();
    delete process.env.PII_FILTER_ENABLED;
    const mod = await import('../pii-filter.js');
    filterPII = mod.filterPII;
    filterPIIString = mod.filterPIIString;
    isPIIFilterEnabled = mod.isPIIFilterEnabled;
  });

  it('should be enabled by default', () => {
    expect(isPIIFilterEnabled()).toBe(true);
  });

  // Test 1: Basic field filtering
  it('should filter name, email, and phone fields', () => {
    const input = {
      id: 12345,
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      phone: '+49 30 12345678',
    };
    const result = filterPII(input);
    expect(result.id).toBe(12345);
    expect(result.firstName).toBe('[FILTERED]');
    expect(result.lastName).toBe('[FILTERED]');
    expect(result.email).toBe('[FILTERED]');
    expect(result.phone).toBe('[FILTERED]');
  });

  // Test 2: Subtree filtering
  it('should filter entire ShippingAddress subtree', () => {
    const input = {
      orderId: 'ORD-001',
      ShippingAddress: {
        street: 'Schönhauser Allee 51',
        city: 'Berlin',
        postalCode: '10437',
        country: 'Germany',
      },
    };
    const result = filterPII(input);
    expect(result.orderId).toBe('ORD-001');
    expect(result.ShippingAddress.street).toBe('[FILTERED]');
    expect(result.ShippingAddress.city).toBe('Berlin');  // city is safe in subtree
    expect(result.ShippingAddress.postalCode).toBe('[FILTERED]');
    expect(result.ShippingAddress.country).toBe('Germany') // country is safe in subtree;
  });

  // Test 3: Non-PII fields preserved
  it('should preserve non-PII fields', () => {
    const input = {
      orderId: 'ORD-001',
      status: 'shipped',
      amount: 99.99,
      currency: 'EUR',
      createdAt: '2024-01-01',
      country: 'DE',
      countryId: 1,
    };
    const result = filterPII(input);
    expect(result).toEqual(input);
  });

  // Test 4: Nested objects filtered recursively
  it('should filter nested objects recursively', () => {
    const input = {
      success: true,
      data: {
        contact: {
          id: 1,
          firstName: 'Max',
          lastName: 'Mustermann',
          options: {
            email: 'max@example.com',
          },
        },
      },
    };
    const result = filterPII(input);
    expect(result.success).toBe(true);
    expect(result.data.contact.id).toBe(1);
    expect(result.data.contact.firstName).toBe('[FILTERED]');
    expect(result.data.contact.lastName).toBe('[FILTERED]');
    expect(result.data.contact.options.email).toBe('[FILTERED]');
  });

  // Test 5: Arrays of objects filtered
  it('should filter arrays of objects', () => {
    const input = {
      entries: [
        { id: 1, firstName: 'Max', lastName: 'Mustermann' },
        { id: 2, firstName: 'Erika', lastName: 'Musterfrau' },
      ],
    };
    const result = filterPII(input);
    expect(result.entries[0].id).toBe(1);
    expect(result.entries[0].firstName).toBe('[FILTERED]');
    expect(result.entries[1].id).toBe(2);
    expect(result.entries[1].lastName).toBe('[FILTERED]');
  });

  // Test 6: Null/undefined values handled — PII fields are still filtered
  it('should handle null and undefined values in PII fields', () => {
    const input = {
      id: 1,
      firstName: null,
      lastName: undefined,
      email: null,
      status: null,
    };
    const result = filterPII(input);
    expect(result.id).toBe(1);
    // PII fields are filtered even when null/undefined
    expect(result.firstName).toBe('[FILTERED]');
    expect(result.lastName).toBe('[FILTERED]');
    expect(result.email).toBe('[FILTERED]');
    // Non-PII null values are preserved
    expect(result.status).toBe(null);
  });

  // Null/undefined as top-level input
  it('should handle null and undefined as top-level input', () => {
    expect(filterPII(null)).toBe(null);
    expect(filterPII(undefined)).toBe(undefined);
  });

  // Test 8: filterPIIString with valid JSON
  it('should filter PII in JSON string', () => {
    const input = JSON.stringify({
      id: 1,
      firstName: 'Max',
      email: 'max@example.com',
    });
    const result = filterPIIString(input);
    const parsed = JSON.parse(result);
    expect(parsed.id).toBe(1);
    expect(parsed.firstName).toBe('[FILTERED]');
    expect(parsed.email).toBe('[FILTERED]');
  });

  // Test 9: filterPIIString with invalid string
  it('should return original string for non-JSON input', () => {
    const input = 'not valid json';
    expect(filterPIIString(input)).toBe('not valid json');
  });

  // Test 10: Mixed content — plentyONE contact response
  it('should filter realistic plentyONE contact response', () => {
    const input = {
      id: 12345,
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      addresses: [
        {
          name1: 'Max',
          name2: 'Mustermann',
          address1: 'Schönhauser Allee 51',
          postalCode: '10437',
          town: 'Berlin',
          phone: '+49 30 12345678',
          countryId: 1,
        },
      ],
    };
    const result = filterPII(input);
    expect(result.id).toBe(12345);
    expect(result.firstName).toBe('[FILTERED]');
    expect(result.lastName).toBe('[FILTERED]');
    expect(result.email).toBe('[FILTERED]');
    expect(result.addresses[0].name1).toBe('[FILTERED]');
    expect(result.addresses[0].name2).toBe('[FILTERED]');
    expect(result.addresses[0].address1).toBe('[FILTERED]');
    expect(result.addresses[0].postalCode).toBe('[FILTERED]');
    expect(result.addresses[0].town).toBe('Berlin');  // town/city is not PII
    expect(result.addresses[0].phone).toBe('[FILTERED]');
    // countryId is NOT PII
    expect(result.addresses[0].countryId).toBe(1);
  });

  // Additional: plentyONE address subtree keys
  it('should filter deliveryAddress and invoiceAddress subtrees', () => {
    const input = {
      orderId: 123,
      deliveryAddress: {
        name1: 'Max',
        address1: 'Berliner Str. 10',
        postalCode: '10115',
        town: 'Berlin',
      },
      invoiceAddress: {
        name1: 'Erika',
        address1: 'Münchner Str. 5',
        postalCode: '80331',
        town: 'München',
      },
    };
    const result = filterPII(input);
    expect(result.orderId).toBe(123);
    expect(result.deliveryAddress.name1).toBe('[FILTERED]');
    expect(result.deliveryAddress.town).toBe('Berlin');  // town/city is safe in subtree
    expect(result.invoiceAddress.name1).toBe('[FILTERED]');
    expect(result.invoiceAddress.town).toBe('München');  // town/city is safe in subtree
  });

  // Financial fields
  it('should filter financial fields', () => {
    const input = {
      id: 1,
      iban: 'DE89370400440532013000',
      bic: 'COBADEFFXXX',
      accountNumber: '0532013000',
      bankName: 'Commerzbank',
    };
    const result = filterPII(input);
    expect(result.id).toBe(1);
    expect(result.iban).toBe('[FILTERED]');
    expect(result.bic).toBe('[FILTERED]');
    expect(result.accountNumber).toBe('[FILTERED]');
    expect(result.bankName).toBe('[FILTERED]');
  });

  // Primitives passed through
  it('should pass through primitives unchanged', () => {
    expect(filterPII(42)).toBe(42);
    expect(filterPII('hello')).toBe('hello');
    expect(filterPII(true)).toBe(true);
    expect(filterPII(null)).toBe(null);
    expect(filterPII(undefined)).toBe(undefined);
  });

  // Product text subtree — name1-3 are product names, NOT PII
  it('should NOT filter name1-3 inside texts subtree (product names)', () => {
    const input = {
      id: 144,
      texts: [
        {
          lang: 'de',
          name1: 'Knitido Plus Kokoro',
          name2: 'Kokoro Füßlinge',
          name3: 'Füßlinge mit offenen Zehen',
          description: '<p>Offen, leicht und nachhaltig</p>',
          urlPath: 'zehensocken/kokoro',
        },
        {
          lang: 'en',
          name1: 'Knitido Plus Kokoro',
          name2: 'Kokoro Toe Liner',
          name3: 'Toe Liner with Open Toes',
          description: '<p>Open, light and sustainable</p>',
          urlPath: 'toe-socks/kokoro',
        },
      ],
    };
    const result = filterPII(input);
    expect(result.id).toBe(144);
    // Product names should NOT be filtered
    expect(result.texts[0].name1).toBe('Knitido Plus Kokoro');
    expect(result.texts[0].name2).toBe('Kokoro Füßlinge');
    expect(result.texts[0].name3).toBe('Füßlinge mit offenen Zehen');
    expect(result.texts[1].name1).toBe('Knitido Plus Kokoro');
    expect(result.texts[1].name2).toBe('Kokoro Toe Liner');
    expect(result.texts[1].name3).toBe('Toe Liner with Open Toes');
    // Other fields preserved
    expect(result.texts[0].description).toBe('<p>Offen, leicht und nachhaltig</p>');
  });

  it('should NOT filter name1-3 inside descriptions subtree', () => {
    const input = [
      {
        lang: 'de',
        name1: 'Marathon TS',
        name2: 'Marathon Zehensocken',
        name3: 'TS Zehensocken',
        description: '<p>Die Knitido Marathon</p>',
      },
    ];
    // Wrap in descriptions key
    const wrapped = { descriptions: input };
    const result = filterPII(wrapped);
    expect(result.descriptions[0].name1).toBe('Marathon TS');
    expect(result.descriptions[0].name2).toBe('Marathon Zehensocken');
  });

  it('should still filter address name1-4 even when product texts exist', () => {
    const input = {
      id: 144,
      texts: [
        { lang: 'de', name1: 'Kokoro', name2: 'Füßlinge' },
      ],
      deliveryAddress: {
        name1: 'Max Mustermann',
        name2: 'c/o Firma',
        address1: 'Berliner Str. 10',
        town: 'Berlin',
      },
    };
    const result = filterPII(input);
    // Product names preserved
    expect(result.texts[0].name1).toBe('Kokoro');
    expect(result.texts[0].name2).toBe('Füßlinge');
    // Address names filtered
    expect(result.deliveryAddress.name1).toBe('[FILTERED]');
    expect(result.deliveryAddress.name2).toBe('[FILTERED]');
    expect(result.deliveryAddress.address1).toBe('[FILTERED]');
    expect(result.deliveryAddress.town).toBe('Berlin');
  });
});

// Test 7: PII_FILTER_ENABLED=false → passthrough
describe('PII Filter (disabled)', () => {
  let filterPII: typeof import('../pii-filter.js').filterPII;
  let filterPIIString: typeof import('../pii-filter.js').filterPIIString;
  let isPIIFilterEnabled: typeof import('../pii-filter.js').isPIIFilterEnabled;

  beforeEach(async () => {
    vi.resetModules();
    process.env.PII_FILTER_ENABLED = 'false';
    const mod = await import('../pii-filter.js');
    filterPII = mod.filterPII;
    filterPIIString = mod.filterPIIString;
    isPIIFilterEnabled = mod.isPIIFilterEnabled;
  });

  afterEach(() => {
    delete process.env.PII_FILTER_ENABLED;
  });

  it('should report filter as disabled', () => {
    expect(isPIIFilterEnabled()).toBe(false);
  });

  it('should pass through data unchanged when disabled', () => {
    const input = {
      id: 1,
      firstName: 'Max',
      email: 'max@example.com',
    };
    const result = filterPII(input);
    expect(result).toEqual(input);
    expect(result).toBe(input); // Same reference, no copy
  });

  it('should pass through JSON string unchanged when disabled', () => {
    const input = JSON.stringify({ firstName: 'Max', email: 'max@example.com' });
    expect(filterPIIString(input)).toBe(input);
  });
});

describe('plentyONE contact options PII filtering', () => {
  let filterPII: typeof import('../pii-filter.js').filterPII;

  beforeEach(async () => {
    vi.resetModules();
    delete process.env.PII_FILTER_ENABLED;
    const mod = await import('../pii-filter.js');
    filterPII = mod.filterPII;
  });

  it('should filter value in options with typeId=1 (phone)', () => {
    const input = {
      id: 41209,
      firstName: 'Max',
      options: [
        { id: 82458, contactId: 41209, typeId: 1, subTypeId: 4, value: '01714055068', priority: 0 },
      ],
    };
    const result = filterPII(input);
    expect(result.firstName).toBe('[FILTERED]');
    expect(result.options[0].value).toBe('[FILTERED]');
    expect(result.options[0].typeId).toBe(1);  // typeId preserved
    expect(result.options[0].id).toBe(82458);  // id preserved
  });

  it('should filter value in options with typeId=2 (email)', () => {
    const input = {
      options: [
        { id: 82459, contactId: 41209, typeId: 2, subTypeId: 4, value: 'test@marketplace.amazon.de', priority: 0 },
      ],
    };
    const result = filterPII(input);
    expect(result.options[0].value).toBe('[FILTERED]');
  });

  it('should filter value in address options with typeId=4 (phone)', () => {
    const input = {
      id: 27807,
      name2: 'Pia',
      options: [
        { id: 41636, addressId: 27807, typeId: 4, value: '01714055068', position: 0 },
      ],
    };
    const result = filterPII(input);
    expect(result.name2).toBe('[FILTERED]');
    expect(result.options[0].value).toBe('[FILTERED]');
  });

  it('should NOT filter value in contact options with non-PII typeId', () => {
    const input = {
      options: [
        { id: 100, contactId: 123, typeId: 3, value: '9', priority: 0 },      // payment method
        { id: 101, contactId: 123, typeId: 6, value: 'de', priority: 0 },     // language
        { id: 102, contactId: 123, typeId: 7, value: '305-123-456', priority: 0 }, // external order id
      ],
    };
    const result = filterPII(input);
    expect(result.options[0].value).toBe('9');
    expect(result.options[1].value).toBe('de');
    expect(result.options[2].value).toBe('305-123-456');
  });

  it('should NOT filter order properties (different typeId meaning)', () => {
    // Order properties use the same typeId/value structure but typeId meanings are different
    // typeId=1: warehouseId, typeId=2: shippingProfile, typeId=4: paymentStatus
    const input = {
      properties: [
        { orderId: 510840, typeId: 1, value: '103' },         // warehouseId
        { orderId: 510840, typeId: 2, value: '6' },            // shippingProfile
        { orderId: 510840, typeId: 4, value: 'fullyPaid' },    // paymentStatus
        { orderId: 510840, typeId: 10, value: 'info@knitido.de' }, // shop email
        { orderId: 510840, typeId: 7, value: '305-123-456' },  // external order id
      ],
    };
    const result = filterPII(input);
    // None should be filtered — these are order properties, not contact options
    expect(result.properties[0].value).toBe('103');
    expect(result.properties[1].value).toBe('6');
    expect(result.properties[2].value).toBe('fullyPaid');
    expect(result.properties[3].value).toBe('info@knitido.de');
    expect(result.properties[4].value).toBe('305-123-456');
  });

  it('should handle mixed PII and non-PII contact options', () => {
    const input = {
      options: [
        { contactId: 1, typeId: 1, value: '0171-1234567' },  // phone → filter
        { contactId: 1, typeId: 3, value: '9' },              // non-PII → keep
        { contactId: 1, typeId: 2, value: 'user@example.com' }, // email → filter
        { contactId: 1, typeId: 6, value: 'en' },             // non-PII → keep
      ],
    };
    const result = filterPII(input);
    expect(result.options[0].value).toBe('[FILTERED]');
    expect(result.options[1].value).toBe('9');
    expect(result.options[2].value).toBe('[FILTERED]');
    expect(result.options[3].value).toBe('en');
  });

  it('should handle realistic plentyONE contact response', () => {
    // Actual structure from plenty_list_contacts
    const input = {
      page: 1,
      entries: [{
        id: 41209,
        firstName: 'Pia',
        lastName: 'Kleimaier',
        email: 'p0yw814l9hj1rv3@marketplace.amazon.de',
        privatePhone: '01714055068',
        fullName: 'Pia Kleimaier',
        lang: 'de',
        referrerId: 4.01,
        options: [
          { id: 82458, contactId: 41209, typeId: 1, subTypeId: 4, value: '01714055068', priority: 0 },
          { id: 82459, contactId: 41209, typeId: 2, subTypeId: 4, value: 'p0yw814l9hj1rv3@marketplace.amazon.de', priority: 0 },
        ],
        accounts: [],
      }],
    };
    const result = filterPII(input);
    expect(result.page).toBe(1);
    expect(result.entries[0].id).toBe(41209);
    expect(result.entries[0].firstName).toBe('[FILTERED]');
    expect(result.entries[0].lastName).toBe('[FILTERED]');
    expect(result.entries[0].email).toBe('[FILTERED]');
    expect(result.entries[0].privatePhone).toBe('[FILTERED]');
    expect(result.entries[0].fullName).toBe('[FILTERED]');
    expect(result.entries[0].lang).toBe('de');
    expect(result.entries[0].referrerId).toBe(4.01);
    expect(result.entries[0].options[0].value).toBe('[FILTERED]');
    expect(result.entries[0].options[1].value).toBe('[FILTERED]');
    expect(result.entries[0].options[0].typeId).toBe(1);
    expect(result.entries[0].options[1].typeId).toBe(2);
  });
});
