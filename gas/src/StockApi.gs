/**
 * plentyONE Stock API for Google Apps Script
 * 
 * 在庫・倉庫情報の検索・取得機能
 * 
 * @requires PlentyOneApi.gs
 */

// =============================================================================
// 在庫検索・一覧
// =============================================================================

/**
 * 在庫情報を検索・一覧取得
 * 
 * @param {Object} params - 検索パラメータ
 * @param {number} params.page - ページ番号（デフォルト: 1）
 * @param {number} params.itemsPerPage - 1ページあたりの件数（デフォルト: 50, 最大: 250）
 * @param {number} params.variationId - バリエーションIDで絞り込み
 * @param {number} params.warehouseId - 倉庫IDで絞り込み
 * @param {string} params.updatedAtFrom - この日時以降に更新された在庫（ISO 8601形式）
 * @param {string} params.updatedAtTo - この日時以前に更新された在庫（ISO 8601形式）
 * @returns {Object} 在庫一覧
 * 
 * @example
 * // バリエーションIDで検索
 * const result = plentyListStock({ variationId: 1234 });
 * 
 * // 倉庫別に検索
 * const result = plentyListStock({ warehouseId: 1 });
 */
function plentyListStock(params) {
  params = params || {};
  
  return makeRequest_('/rest/stockmanagement/stock', {
    query: {
      page: params.page,
      itemsPerPage: params.itemsPerPage,
      variationId: params.variationId,
      warehouseId: params.warehouseId,
      updatedAtFrom: params.updatedAtFrom,
      updatedAtTo: params.updatedAtTo
    }
  });
}

/**
 * バリエーションの在庫を取得（簡易版）
 * 
 * @param {number} variationId - バリエーションID
 * @returns {Object} 在庫情報
 */
function plentyGetVariationStock(variationId) {
  if (!variationId) {
    return createError_('MISSING_PARAMETER', 'バリエーションIDを指定してください');
  }
  
  return plentyListStock({ variationId: variationId });
}

// =============================================================================
// 倉庫
// =============================================================================

/**
 * 倉庫一覧を取得
 * 
 * @returns {Object} 倉庫一覧
 */
function plentyListWarehouses() {
  return makeRequest_('/rest/stockmanagement/warehouses');
}

/**
 * 倉庫の詳細情報を取得
 * 
 * @param {number} warehouseId - 倉庫ID
 * @returns {Object} 倉庫詳細
 */
function plentyGetWarehouse(warehouseId) {
  if (!warehouseId) {
    return createError_('MISSING_PARAMETER', '倉庫IDを指定してください');
  }
  
  return makeRequest_('/rest/stockmanagement/warehouses/' + warehouseId);
}

/**
 * 倉庫の在庫一覧を取得
 * 
 * @param {number} warehouseId - 倉庫ID
 * @param {Object} params - オプション
 * @param {number} params.page - ページ番号
 * @param {number} params.itemsPerPage - 1ページあたりの件数
 * @param {string} params.updatedAtFrom - この日時以降に更新された在庫
 * @returns {Object} 在庫一覧
 */
function plentyGetWarehouseStock(warehouseId, params) {
  if (!warehouseId) {
    return createError_('MISSING_PARAMETER', '倉庫IDを指定してください');
  }
  
  params = params || {};
  
  return makeRequest_('/rest/stockmanagement/warehouses/' + warehouseId + '/stock', {
    query: {
      page: params.page,
      itemsPerPage: params.itemsPerPage,
      updatedAtFrom: params.updatedAtFrom
    }
  });
}

/**
 * 倉庫の棚番一覧を取得
 * 
 * @param {number} warehouseId - 倉庫ID
 * @returns {Object} 棚番一覧
 */
function plentyListWarehouseLocations(warehouseId) {
  if (!warehouseId) {
    return createError_('MISSING_PARAMETER', '倉庫IDを指定してください');
  }
  
  return makeRequest_('/rest/stockmanagement/warehouses/' + warehouseId + '/locations');
}

// =============================================================================
// 在庫移動履歴
// =============================================================================

/**
 * 在庫移動履歴を取得
 * 
 * @param {Object} params - 検索パラメータ
 * @param {number} params.variationId - バリエーションIDで絞り込み
 * @param {number} params.warehouseId - 倉庫IDで絞り込み
 * @param {string} params.createdAtFrom - この日時以降の移動（ISO 8601形式）
 * @param {string} params.createdAtTo - この日時以前の移動（ISO 8601形式）
 * @returns {Object} 在庫移動履歴
 * 
 * @example
 * // バリエーションの移動履歴
 * const result = plentyGetStockMovements({ variationId: 1234 });
 * 
 * // 今日の移動履歴
 * const today = new Date().toISOString().split('T')[0];
 * const result = plentyGetStockMovements({ createdAtFrom: today + 'T00:00:00Z' });
 */
function plentyGetStockMovements(params) {
  params = params || {};
  
  return makeRequest_('/rest/stockmanagement/stock/movements', {
    query: {
      variationId: params.variationId,
      warehouseId: params.warehouseId,
      createdAtFrom: params.createdAtFrom,
      createdAtTo: params.createdAtTo
    }
  });
}

// =============================================================================
// Workspace Studio向け簡易関数
// =============================================================================

/**
 * 在庫を検索（Workspace Studio用）
 * 
 * バリエーションIDまたは商品名で在庫を検索します。
 * 
 * @param {string} query - 検索クエリ（バリエーションID or 商品名）
 * @returns {Object} 在庫情報
 * 
 * @example
 * plentySearchStock('1234');           // バリエーションID
 * plentySearchStock('Tabi Sneaker');   // 商品名（→商品検索→在庫取得）
 */
function plentySearchStock(query) {
  if (!query) {
    return createError_('MISSING_PARAMETER', '検索キーワードを指定してください');
  }
  
  query = String(query).trim();
  
  // 数字のみの場合はバリエーションIDとして検索
  if (/^\d+$/.test(query)) {
    return plentyGetVariationStock(parseInt(query, 10));
  }
  
  // それ以外は商品名として検索し、在庫を取得
  const itemsResult = plentySearchItems({ name: query, with: 'variations' });
  
  if (!itemsResult.success) {
    return itemsResult;
  }
  
  const items = itemsResult.data.entries || itemsResult.data || [];
  
  if (items.length === 0) {
    return {
      success: true,
      data: {
        message: '該当する商品が見つかりませんでした',
        items: []
      }
    };
  }
  
  // 最初の商品のバリエーション在庫を取得
  var stockInfo = [];
  var item = items[0];
  
  if (item.variations) {
    item.variations.forEach(function(v) {
      var stockResult = plentyGetVariationStock(v.id);
      if (stockResult.success) {
        stockInfo.push({
          variationId: v.id,
          variationNumber: v.number,
          stock: stockResult.data
        });
      }
    });
  }
  
  return {
    success: true,
    data: {
      item: {
        id: item.id,
        name: item.texts ? item.texts[0].name1 : 'Unknown'
      },
      stockByVariation: stockInfo
    }
  };
}

/**
 * 在庫サマリーを取得（Workspace Studio用）
 * 
 * 全倉庫の在庫状況サマリーを返します。
 * 
 * @returns {Object} 在庫サマリー
 */
function plentyGetStockSummary() {
  // 倉庫一覧を取得
  const warehousesResult = plentyListWarehouses();
  
  if (!warehousesResult.success) {
    return warehousesResult;
  }
  
  const warehouses = warehousesResult.data.entries || warehousesResult.data || [];
  var summary = [];
  
  warehouses.forEach(function(warehouse) {
    var stockResult = plentyGetWarehouseStock(warehouse.id, { itemsPerPage: 1 });
    
    summary.push({
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      // 注意: 正確な在庫数はページネーションを考慮する必要があります
      // ここでは概要のみ
      hasStock: stockResult.success && stockResult.data && 
        (stockResult.data.entries || stockResult.data || []).length > 0
    });
  });
  
  return {
    success: true,
    data: {
      warehouses: summary,
      totalWarehouses: warehouses.length
    }
  };
}

/**
 * 低在庫アラート（Workspace Studio用）
 * 
 * 指定した閾値以下の在庫を取得します。
 * 
 * @param {number} threshold - 在庫閾値（デフォルト: 10）
 * @param {number} warehouseId - 倉庫ID（省略時は全倉庫）
 * @returns {Object} 低在庫商品一覧
 */
function plentyGetLowStockAlert(threshold, warehouseId) {
  threshold = threshold || 10;
  
  var params = {
    itemsPerPage: 250
  };
  
  if (warehouseId) {
    params.warehouseId = warehouseId;
  }
  
  const result = plentyListStock(params);
  
  if (!result.success) {
    return result;
  }
  
  const stocks = result.data.entries || result.data || [];
  
  // 閾値以下の在庫をフィルタ
  var lowStockItems = stocks.filter(function(s) {
    var quantity = s.stockPhysical || s.stockNet || 0;
    return quantity <= threshold && quantity >= 0;
  });
  
  // 在庫数でソート（少ない順）
  lowStockItems.sort(function(a, b) {
    var stockA = a.stockPhysical || a.stockNet || 0;
    var stockB = b.stockPhysical || b.stockNet || 0;
    return stockA - stockB;
  });
  
  return {
    success: true,
    data: {
      threshold: threshold,
      totalLowStock: lowStockItems.length,
      items: lowStockItems.slice(0, 50) // 最大50件
    }
  };
}

/**
 * 今日の在庫移動を取得（Workspace Studio用）
 * 
 * @returns {Object} 今日の在庫移動履歴
 */
function plentyGetTodayStockMovements() {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  return plentyGetStockMovements({
    createdAtFrom: startOfDay.toISOString()
  });
}
