/**
 * plentyONE Items API for Google Apps Script
 * 
 * 商品・バリエーション情報の検索・取得機能
 * 
 * @requires PlentyOneApi.gs
 */

// =============================================================================
// 商品検索・一覧
// =============================================================================

/**
 * 商品を検索・一覧取得
 * 
 * @param {Object} params - 検索パラメータ
 * @param {number} params.page - ページ番号（デフォルト: 1）
 * @param {number} params.itemsPerPage - 1ページあたりの件数（デフォルト: 50, 最大: 250）
 * @param {string} params.name - 商品名で絞り込み
 * @param {string} params.id - 商品ID（カンマ区切りで複数指定可）
 * @param {string} params.lang - 言語コード（例: 'de', 'en', 'ja'）
 * @param {string} params.with - 関連データを含める
 * @returns {Object} 商品一覧
 * 
 * @example
 * // 商品名で検索
 * const result = plentySearchItems({ name: 'Zehensocken' });
 * 
 * // 複数IDで検索
 * const result = plentySearchItems({ id: '123,456,789' });
 * 
 * // 日本語説明を取得
 * const result = plentySearchItems({ name: 'Tabi', lang: 'ja' });
 */
function plentySearchItems(params) {
  params = params || {};
  
  return makeRequest_('/rest/items', {
    query: {
      page: params.page,
      itemsPerPage: params.itemsPerPage,
      with: params.with,
      lang: params.lang,
      name: params.name,
      id: params.id
    }
  });
}

/**
 * 商品を名前で検索（簡易版）
 * 
 * @param {string} name - 商品名（部分一致）
 * @param {string} lang - 言語コード（デフォルト: 'de'）
 * @returns {Object} 検索結果
 * 
 * @example
 * const result = plentyFindItemByName('Sneaker');
 * const result = plentyFindItemByName('足袋', 'ja');
 */
function plentyFindItemByName(name, lang) {
  if (!name) {
    return createError_('MISSING_PARAMETER', '商品名を指定してください');
  }
  
  return plentySearchItems({
    name: name,
    lang: lang || 'de',
    with: 'itemImages'
  });
}

// =============================================================================
// 商品詳細取得
// =============================================================================

/**
 * 商品の詳細情報を取得
 * 
 * @param {number} itemId - 商品ID
 * @param {Object} params - オプション
 * @param {string} params.lang - 言語コード
 * @param {string} params.with - 関連データを含める
 * @returns {Object} 商品詳細
 * 
 * @example
 * const result = plentyGetItem(123);
 * const result = plentyGetItem(123, { lang: 'en', with: 'itemImages,variations' });
 */
function plentyGetItem(itemId, params) {
  if (!itemId) {
    return createError_('MISSING_PARAMETER', '商品IDを指定してください');
  }
  
  params = params || {};
  
  return makeRequest_('/rest/items/' + itemId, {
    query: {
      with: params.with,
      lang: params.lang
    }
  });
}

// =============================================================================
// バリエーション
// =============================================================================

/**
 * 商品のバリエーション一覧を取得
 * 
 * @param {number} itemId - 商品ID
 * @param {Object} params - オプション
 * @param {string} params.lang - 言語コード
 * @param {string} params.with - 関連データを含める
 * @returns {Object} バリエーション一覧
 * 
 * @example
 * const result = plentyListVariations(123);
 */
function plentyListVariations(itemId, params) {
  if (!itemId) {
    return createError_('MISSING_PARAMETER', '商品IDを指定してください');
  }
  
  params = params || {};
  
  return makeRequest_('/rest/items/' + itemId + '/variations', {
    query: {
      with: params.with,
      lang: params.lang
    }
  });
}

/**
 * 特定のバリエーションを取得
 * 
 * @param {number} itemId - 商品ID
 * @param {number} variationId - バリエーションID
 * @param {Object} params - オプション
 * @param {string} params.lang - 言語コード
 * @param {string} params.with - 関連データを含める
 * @returns {Object} バリエーション詳細
 * 
 * @example
 * const result = plentyGetVariation(123, 456);
 */
function plentyGetVariation(itemId, variationId, params) {
  if (!itemId || !variationId) {
    return createError_('MISSING_PARAMETER', '商品IDとバリエーションIDを指定してください');
  }
  
  params = params || {};
  
  return makeRequest_('/rest/items/' + itemId + '/variations/' + variationId, {
    query: {
      with: params.with,
      lang: params.lang
    }
  });
}

// =============================================================================
// バーコード
// =============================================================================

/**
 * バーコード一覧を取得
 * 
 * @returns {Object} バーコード一覧
 * 
 * @example
 * const result = plentyListBarcodes();
 */
function plentyListBarcodes() {
  return makeRequest_('/rest/items/barcodes');
}

// =============================================================================
// Workspace Studio向け簡易関数
// =============================================================================

/**
 * 商品情報を検索（Workspace Studio用）
 * 
 * 商品ID、商品名、SKUなどで検索できます。
 * 
 * @param {string} query - 検索クエリ
 * @param {string} lang - 言語コード（デフォルト: 'de'）
 * @returns {Object} 検索結果
 * 
 * @example
 * plentySearchProduct('Tabi Sneaker');
 * plentySearchProduct('123');
 */
function plentySearchProduct(query, lang) {
  if (!query) {
    return createError_('MISSING_PARAMETER', '検索キーワードを指定してください');
  }
  
  query = String(query).trim();
  lang = lang || 'de';
  
  // 数字のみの場合はIDとして検索
  if (/^\d+$/.test(query)) {
    const result = plentyGetItem(parseInt(query, 10), { lang: lang, with: 'itemImages' });
    if (result.success) {
      return result;
    }
    // ID検索で見つからない場合は名前検索にフォールバック
  }
  
  // 名前として検索
  return plentyFindItemByName(query, lang);
}

/**
 * 商品の全情報を取得（Workspace Studio用）
 * 
 * 商品の詳細情報とバリエーション一覧をまとめて取得します。
 * 
 * @param {number} itemId - 商品ID
 * @param {string} lang - 言語コード（デフォルト: 'de'）
 * @returns {Object} 商品の全情報
 */
function plentyGetProductDetail(itemId, lang) {
  if (!itemId) {
    return createError_('MISSING_PARAMETER', '商品IDを指定してください');
  }
  
  lang = lang || 'de';
  
  // 商品情報を取得
  const itemResult = plentyGetItem(itemId, { lang: lang, with: 'itemImages' });
  if (!itemResult.success) {
    return itemResult;
  }
  
  // バリエーション一覧を取得
  const variationsResult = plentyListVariations(itemId, { lang: lang });
  
  return {
    success: true,
    data: {
      item: itemResult.data,
      variations: variationsResult.success ? variationsResult.data : [],
      variationCount: variationsResult.success && variationsResult.data ? 
        (variationsResult.data.entries ? variationsResult.data.entries.length : 0) : 0
    }
  };
}

/**
 * 商品のサイズ・カラー展開を取得（Workspace Studio用）
 * 
 * @param {number} itemId - 商品ID
 * @returns {Object} サイズ・カラー情報
 */
function plentyGetProductOptions(itemId) {
  if (!itemId) {
    return createError_('MISSING_PARAMETER', '商品IDを指定してください');
  }
  
  const variationsResult = plentyListVariations(itemId, { with: 'variationAttributeValues' });
  
  if (!variationsResult.success) {
    return variationsResult;
  }
  
  // バリエーションからサイズ・カラーを抽出
  const sizes = new Set();
  const colors = new Set();
  const variations = variationsResult.data.entries || variationsResult.data || [];
  
  variations.forEach(function(v) {
    if (v.variationAttributeValues) {
      v.variationAttributeValues.forEach(function(attr) {
        // 属性名に基づいて分類（plentyONEの設定に依存）
        if (attr.attributeId === 1) { // サイズ属性ID（要調整）
          sizes.add(attr.value);
        } else if (attr.attributeId === 2) { // カラー属性ID（要調整）
          colors.add(attr.value);
        }
      });
    }
  });
  
  return {
    success: true,
    data: {
      itemId: itemId,
      sizes: Array.from(sizes),
      colors: Array.from(colors),
      totalVariations: variations.length
    }
  };
}
