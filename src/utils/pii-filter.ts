/**
 * PII Filter — removes personally identifiable information from MCP responses.
 * Enabled by default. Disable with PII_FILTER_ENABLED=false (server-side only).
 */

const PII_FILTER_ENABLED = process.env.PII_FILTER_ENABLED !== 'false';

const FILTERED = '[FILTERED]';

// Case-insensitive field name patterns that indicate PII
const PII_FIELD_PATTERNS: RegExp[] = [
  // Names — require a prefix to avoid matching generic "name" (e.g., order name "#1001")
  /^(first|last|middle|full|display|buyer|owner|customer|sender|recipient|contact)[_-]?name\d*$/i,
  /^name[1-4]$/i,  // plentyONE address name1-name4
  /^(formOfAddress|salutation)$/i,

  // Email
  /e?-?mail(address)?$/i,

  // Phone/Fax
  /^(phone|fax|mobile|tel(ephone)?)(number)?$/i,
  /^(private|business|home|work)?(phone|fax|mobile)$/i,
  /^privateMobile$/i,

  // Address components
  /^(street|address)\d*$/i,
  /^(house|apt|suite|unit)(number)?$/i,
  /^(postal|zip|post)(code)?$/i,
  // Note: country, city/town, state/region are NOT PII (geographic, too general)

  // Financial
  /^(iban|bic|swift|account(number)?|routing(number)?|bank(name)?)$/i,
  /^(card|credit|debit)(number)?$/i,

  // IDs that could identify a person
  /^(ssn|social|tax[_-]?id|vat[_-]?(id|number)|national[_-]?id)$/i,

  // IP / Device
  /^(ip[_-]?address|device[_-]?id|user[_-]?agent)$/i,

  // Amazon SP-API specific (top-level fields outside subtrees)
  /^(BuyerName|BuyerEmail|BuyerTaxInfo)$/i,
  /^AddressLine[1-3]$/i,
];

// Top-level object keys whose entire subtree should be filtered
const PII_SUBTREE_KEYS: RegExp[] = [
  /^(ShippingAddress|BillingAddress|DefaultAddress|BuyerInfo)$/i,
  /^(shippingAddress|billingAddress|defaultAddress|buyerInfo)$/i,
  /^(deliveryAddress|invoiceAddress|senderAddress)$/i,
];

// Fields that are safe to keep even inside PII subtrees
const SAFE_IN_SUBTREE: RegExp[] = [
  /^country(Code(V\d)?|Id|Name)?$/i,
  /^(company|companyName)$/i,
  /^(id|countryId|stateId)$/i,
  /^(city|town|locality|suburb)$/i,
  /^(state|province|region|county)$/i,
];

function isPIIFieldName(key: string): boolean {
  return PII_FIELD_PATTERNS.some(pattern => pattern.test(key));
}

function isPIISubtree(key: string): boolean {
  return PII_SUBTREE_KEYS.some(pattern => pattern.test(key));
}

function isSafeInSubtree(key: string): boolean {
  return SAFE_IN_SUBTREE.some(pattern => pattern.test(key));
}

// plentyONE contact/address options: typeId values that contain PII in their "value" field
// typeId 1 = phone (contact options)
// typeId 2 = email (contact options)
// typeId 4 = phone (address options)
// typeId 5 = email (address options)
const PLENTY_PII_OPTION_TYPE_IDS = new Set([1, 2, 4, 5]);

/**
 * Check if an object is a plentyONE contact/address option entry with PII.
 * Contact options have: { contactId, typeId, value, ... }
 * Address options have: { addressId, typeId, value, ... }
 * Order properties also have { typeId, value } but different typeId meanings — NOT PII.
 * We distinguish by presence of contactId or addressId.
 */
function isPlentyOptionWithPII(obj: Record<string, any>): boolean {
  if (typeof obj.typeId !== 'number' || typeof obj.value !== 'string') return false;
  const isContactOrAddressOption = 'contactId' in obj || 'addressId' in obj;
  return isContactOrAddressOption && PLENTY_PII_OPTION_TYPE_IDS.has(obj.typeId);
}

function filterObject(obj: any, inPIISubtree: boolean = false): any {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => filterObject(item, inPIISubtree));
  }

  if (typeof obj === 'object') {
    // Context-aware: plentyONE option objects with PII typeIds
    const isPlentyPIIOption = isPlentyOptionWithPII(obj);

    const filtered: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (isPIISubtree(key)) {
        // Filter subtree, but safe fields within are preserved
        filtered[key] = filterObject(value, true);
      } else if (isPlentyPIIOption && key === 'value') {
        // plentyONE option with PII typeId — filter the value field
        filtered[key] = FILTERED;
      } else if (inPIISubtree && isSafeInSubtree(key)) {
        // Safe field inside PII subtree — preserve it
        filtered[key] = value;
      } else if (inPIISubtree || isPIIFieldName(key)) {
        // Replace value with [FILTERED] (keep key for structure visibility)
        if (typeof value === 'object' && value !== null) {
          filtered[key] = filterObject(value, true);
        } else {
          filtered[key] = FILTERED;
        }
      } else {
        filtered[key] = filterObject(value, false);
      }
    }
    return filtered;
  }

  // Primitive in PII subtree
  if (inPIISubtree) return FILTERED;

  return obj;
}

/**
 * Filter PII from a response object.
 * Returns the filtered object (or original if filtering is disabled).
 */
export function filterPII<T>(data: T): T {
  if (!PII_FILTER_ENABLED) return data;
  return filterObject(data) as T;
}

/**
 * Filter PII from a JSON string.
 * Parses, filters, re-serializes. Returns filtered string.
 * If parsing fails, returns original string.
 */
export function filterPIIString(jsonString: string): string {
  if (!PII_FILTER_ENABLED) return jsonString;
  try {
    const parsed = JSON.parse(jsonString);
    const filtered = filterObject(parsed);
    return JSON.stringify(filtered, null, 2);
  } catch {
    return jsonString;  // Not JSON, return as-is
  }
}

/**
 * Check if PII filtering is currently enabled.
 */
export function isPIIFilterEnabled(): boolean {
  return PII_FILTER_ENABLED;
}
