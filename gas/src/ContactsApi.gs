/**
 * plentyONE Contacts API for Google Apps Script
 * 
 * 顧客情報の検索・取得機能
 * 
 * @requires PlentyOneApi.gs
 */

// =============================================================================
// 顧客検索・一覧
// =============================================================================

/**
 * 顧客を検索・一覧取得
 * 
 * @param {Object} params - 検索パラメータ
 * @param {number} params.page - ページ番号（デフォルト: 1）
 * @param {number} params.itemsPerPage - 1ページあたりの件数（デフォルト: 50, 最大: 250）
 * @param {string} params.email - メールアドレスで絞り込み
 * @param {string} params.name - 名前で絞り込み
 * @param {number} params.contactId - 顧客IDで絞り込み
 * @param {number} params.typeId - 顧客タイプIDで絞り込み
 * @param {string} params.updatedAtFrom - この日時以降に更新された顧客（ISO 8601形式）
 * @param {string} params.with - 関連データを含める（例: 'addresses,orders'）
 * @returns {Object} 顧客一覧
 * 
 * @example
 * // メールで検索
 * const result = plentyListContacts({ email: 'customer@example.com' });
 * 
 * // 名前で検索
 * const result = plentyListContacts({ name: 'Müller' });
 * 
 * // ページネーション
 * const result = plentyListContacts({ page: 2, itemsPerPage: 100 });
 */
function plentyListContacts(params) {
  params = params || {};
  
  return makeRequest_('/rest/accounts/contacts', {
    query: {
      page: params.page,
      itemsPerPage: params.itemsPerPage,
      with: params.with,
      email: params.email,
      name: params.name,
      contactId: params.contactId,
      typeId: params.typeId,
      updatedAtFrom: params.updatedAtFrom
    }
  });
}

/**
 * 顧客をメールアドレスで検索（簡易版）
 * 
 * @param {string} email - メールアドレス
 * @returns {Object} 検索結果
 * 
 * @example
 * const result = plentyFindContactByEmail('customer@example.com');
 */
function plentyFindContactByEmail(email) {
  if (!email) {
    return createError_('MISSING_PARAMETER', 'メールアドレスを指定してください');
  }
  
  return plentyListContacts({ email: email, with: 'addresses' });
}

/**
 * 顧客を名前で検索（簡易版）
 * 
 * @param {string} name - 名前（部分一致）
 * @returns {Object} 検索結果
 * 
 * @example
 * const result = plentyFindContactByName('田中');
 */
function plentyFindContactByName(name) {
  if (!name) {
    return createError_('MISSING_PARAMETER', '名前を指定してください');
  }
  
  return plentyListContacts({ name: name, with: 'addresses' });
}

// =============================================================================
// 顧客詳細取得
// =============================================================================

/**
 * 顧客の詳細情報を取得
 * 
 * @param {number} contactId - 顧客ID
 * @param {string} withRelations - 関連データを含める（例: 'addresses,orders'）
 * @returns {Object} 顧客詳細
 * 
 * @example
 * const result = plentyGetContact(12345);
 * const result = plentyGetContact(12345, 'addresses,orders');
 */
function plentyGetContact(contactId, withRelations) {
  if (!contactId) {
    return createError_('MISSING_PARAMETER', '顧客IDを指定してください');
  }
  
  return makeRequest_('/rest/accounts/contacts/' + contactId, {
    query: {
      with: withRelations
    }
  });
}

/**
 * 顧客の住所一覧を取得
 * 
 * @param {number} contactId - 顧客ID
 * @returns {Object} 住所一覧
 * 
 * @example
 * const result = plentyGetContactAddresses(12345);
 */
function plentyGetContactAddresses(contactId) {
  if (!contactId) {
    return createError_('MISSING_PARAMETER', '顧客IDを指定してください');
  }
  
  return makeRequest_('/rest/accounts/contacts/' + contactId + '/addresses');
}

/**
 * 顧客の注文履歴を取得
 * 
 * @param {number} contactId - 顧客ID
 * @returns {Object} 注文一覧
 * 
 * @example
 * const result = plentyGetContactOrders(12345);
 */
function plentyGetContactOrders(contactId) {
  if (!contactId) {
    return createError_('MISSING_PARAMETER', '顧客IDを指定してください');
  }
  
  return makeRequest_('/rest/accounts/contacts/' + contactId + '/orders');
}

// =============================================================================
// Workspace Studio向け簡易関数
// =============================================================================

/**
 * 顧客情報を自然言語で検索（Workspace Studio用）
 * 
 * この関数はWorkspace Studioのエージェントから呼び出されることを想定しています。
 * メールアドレス、名前、顧客IDのいずれかで検索できます。
 * 
 * @param {string} query - 検索クエリ（メール、名前、またはID）
 * @returns {Object} 検索結果
 * 
 * @example
 * // エージェントからの呼び出し例
 * plentySearchContact('customer@example.com');
 * plentySearchContact('田中太郎');
 * plentySearchContact('12345');
 */
function plentySearchContact(query) {
  if (!query) {
    return createError_('MISSING_PARAMETER', '検索キーワードを指定してください');
  }
  
  query = String(query).trim();
  
  // 数字のみの場合はIDとして検索
  if (/^\d+$/.test(query)) {
    return plentyGetContact(parseInt(query, 10), 'addresses');
  }
  
  // @を含む場合はメールとして検索
  if (query.indexOf('@') !== -1) {
    return plentyFindContactByEmail(query);
  }
  
  // それ以外は名前として検索
  return plentyFindContactByName(query);
}

/**
 * 顧客情報のサマリーを取得（Workspace Studio用）
 * 
 * 顧客の基本情報と最近の注文をまとめて取得します。
 * 
 * @param {number} contactId - 顧客ID
 * @returns {Object} 顧客サマリー
 */
function plentyGetContactSummary(contactId) {
  if (!contactId) {
    return createError_('MISSING_PARAMETER', '顧客IDを指定してください');
  }
  
  // 顧客情報を取得
  const contactResult = plentyGetContact(contactId, 'addresses');
  if (!contactResult.success) {
    return contactResult;
  }
  
  // 注文履歴を取得
  const ordersResult = plentyGetContactOrders(contactId);
  
  return {
    success: true,
    data: {
      contact: contactResult.data,
      recentOrders: ordersResult.success ? ordersResult.data : [],
      orderCount: ordersResult.success && ordersResult.data ? ordersResult.data.length : 0
    }
  };
}
