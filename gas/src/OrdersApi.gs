/**
 * plentyONE Orders API for Google Apps Script
 * 
 * 注文情報の検索・取得機能
 * 
 * @requires PlentyOneApi.gs
 */

// =============================================================================
// 注文ステータス定義
// =============================================================================

/**
 * plentyONE注文ステータス
 * 参照用の定数オブジェクト
 */
var PLENTY_ORDER_STATUS = {
  // 入金前
  INCOMPLETE: 1,
  WAITING_FOR_PAYMENT: 3,
  
  // 入金済み・処理中
  PAID: 5,
  READY_FOR_SHIPPING: 6,
  
  // 発送済み
  SHIPPED: 7,
  
  // 完了
  COMPLETED: 8,
  
  // キャンセル
  CANCELLED: 8.1,
  
  // 返品
  RETURNED: 9
};

// =============================================================================
// 注文検索・一覧
// =============================================================================

/**
 * 注文を検索・一覧取得
 * 
 * @param {Object} params - 検索パラメータ
 * @param {number} params.page - ページ番号（デフォルト: 1）
 * @param {number} params.itemsPerPage - 1ページあたりの件数（デフォルト: 50, 最大: 250）
 * @param {number} params.statusFrom - ステータス下限
 * @param {number} params.statusTo - ステータス上限
 * @param {string} params.createdAtFrom - この日時以降に作成された注文（ISO 8601形式）
 * @param {string} params.createdAtTo - この日時以前に作成された注文（ISO 8601形式）
 * @param {number} params.plentyId - クライアント/ショップID
 * @param {string} params.with - 関連データを含める（例: 'addresses,orderItems,documents'）
 * @returns {Object} 注文一覧
 * 
 * @example
 * // 今日の注文を取得
 * const today = new Date().toISOString().split('T')[0];
 * const result = plentySearchOrders({ createdAtFrom: today + 'T00:00:00Z' });
 * 
 * // 発送待ちの注文を取得
 * const result = plentySearchOrders({ statusFrom: 5, statusTo: 6 });
 */
function plentySearchOrders(params) {
  params = params || {};
  
  return makeRequest_('/rest/orders', {
    query: {
      page: params.page,
      itemsPerPage: params.itemsPerPage,
      with: params.with,
      statusFrom: params.statusFrom,
      statusTo: params.statusTo,
      createdAtFrom: params.createdAtFrom,
      createdAtTo: params.createdAtTo,
      plentyId: params.plentyId
    }
  });
}

/**
 * 今日の注文を取得（簡易版）
 * 
 * @returns {Object} 今日の注文一覧
 */
function plentyGetTodayOrders() {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  return plentySearchOrders({
    createdAtFrom: startOfDay.toISOString(),
    with: 'addresses,orderItems',
    itemsPerPage: 250
  });
}

/**
 * 最近の注文を取得（簡易版）
 * 
 * @param {number} days - 過去何日分を取得するか（デフォルト: 7）
 * @returns {Object} 注文一覧
 */
function plentyGetRecentOrders(days) {
  days = days || 7;
  
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  
  return plentySearchOrders({
    createdAtFrom: fromDate.toISOString(),
    with: 'addresses,orderItems',
    itemsPerPage: 250
  });
}

/**
 * 発送待ちの注文を取得（簡易版）
 * 
 * @returns {Object} 発送待ち注文一覧
 */
function plentyGetPendingShipmentOrders() {
  return plentySearchOrders({
    statusFrom: 5,  // 入金済み
    statusTo: 6.9,  // 発送準備完了まで
    with: 'addresses,orderItems',
    itemsPerPage: 250
  });
}

// =============================================================================
// 注文詳細取得
// =============================================================================

/**
 * 注文の詳細情報を取得
 * 
 * @param {number} orderId - 注文ID
 * @param {string} withRelations - 関連データを含める（例: 'addresses,orderItems,documents'）
 * @returns {Object} 注文詳細
 * 
 * @example
 * const result = plentyGetOrder(12345);
 * const result = plentyGetOrder(12345, 'addresses,orderItems,documents');
 */
function plentyGetOrder(orderId, withRelations) {
  if (!orderId) {
    return createError_('MISSING_PARAMETER', '注文IDを指定してください');
  }
  
  return makeRequest_('/rest/orders/' + orderId, {
    query: {
      with: withRelations
    }
  });
}

/**
 * 注文の商品明細を取得
 * 
 * @param {number} orderId - 注文ID
 * @returns {Object} 注文明細一覧
 */
function plentyGetOrderItems(orderId) {
  if (!orderId) {
    return createError_('MISSING_PARAMETER', '注文IDを指定してください');
  }
  
  return makeRequest_('/rest/orders/' + orderId + '/items');
}

/**
 * 注文の住所情報を取得
 * 
 * @param {number} orderId - 注文ID
 * @returns {Object} 住所情報（請求先・配送先など）
 */
function plentyGetOrderAddresses(orderId) {
  if (!orderId) {
    return createError_('MISSING_PARAMETER', '注文IDを指定してください');
  }
  
  return makeRequest_('/rest/orders/' + orderId + '/addresses');
}

/**
 * 注文の伝票一覧を取得
 * 
 * @param {number} orderId - 注文ID
 * @returns {Object} 伝票一覧（請求書、納品書など）
 */
function plentyGetOrderDocuments(orderId) {
  if (!orderId) {
    return createError_('MISSING_PARAMETER', '注文IDを指定してください');
  }
  
  return makeRequest_('/rest/orders/' + orderId + '/documents');
}

/**
 * 注文の配送情報を取得
 * 
 * @param {number} orderId - 注文ID
 * @returns {Object} 配送パッケージ情報
 */
function plentyGetOrderShipping(orderId) {
  if (!orderId) {
    return createError_('MISSING_PARAMETER', '注文IDを指定してください');
  }
  
  return makeRequest_('/rest/orders/' + orderId + '/shipping/packages');
}

// =============================================================================
// Workspace Studio向け簡易関数
// =============================================================================

/**
 * 注文情報を検索（Workspace Studio用）
 * 
 * 注文ID、顧客名、日付などで検索できます。
 * 
 * @param {string} query - 検索クエリ（注文ID or 日付）
 * @returns {Object} 検索結果
 * 
 * @example
 * plentySearchOrder('12345');        // 注文ID
 * plentySearchOrder('today');        // 今日の注文
 * plentySearchOrder('2025-01-15');   // 特定日の注文
 */
function plentySearchOrder(query) {
  if (!query) {
    return createError_('MISSING_PARAMETER', '検索キーワードを指定してください');
  }
  
  query = String(query).trim().toLowerCase();
  
  // 「今日」「本日」の場合
  if (query === 'today' || query === '今日' || query === '本日') {
    return plentyGetTodayOrders();
  }
  
  // 「最近」「直近」の場合
  if (query === 'recent' || query === '最近' || query === '直近') {
    return plentyGetRecentOrders(7);
  }
  
  // 「発送待ち」「未発送」の場合
  if (query === 'pending' || query === '発送待ち' || query === '未発送') {
    return plentyGetPendingShipmentOrders();
  }
  
  // 数字のみの場合は注文IDとして検索
  if (/^\d+$/.test(query)) {
    return plentyGetOrder(parseInt(query, 10), 'addresses,orderItems,documents');
  }
  
  // 日付形式の場合（YYYY-MM-DD）
  if (/^\d{4}-\d{2}-\d{2}$/.test(query)) {
    return plentySearchOrders({
      createdAtFrom: query + 'T00:00:00Z',
      createdAtTo: query + 'T23:59:59Z',
      with: 'addresses,orderItems'
    });
  }
  
  // それ以外は最近の注文を返す
  return plentyGetRecentOrders(30);
}

/**
 * 注文の全情報を取得（Workspace Studio用）
 * 
 * @param {number} orderId - 注文ID
 * @returns {Object} 注文の全情報
 */
function plentyGetOrderDetail(orderId) {
  if (!orderId) {
    return createError_('MISSING_PARAMETER', '注文IDを指定してください');
  }
  
  // 注文基本情報（関連データ含む）
  const orderResult = plentyGetOrder(orderId, 'addresses,orderItems,documents');
  if (!orderResult.success) {
    return orderResult;
  }
  
  // 配送情報を追加取得
  const shippingResult = plentyGetOrderShipping(orderId);
  
  return {
    success: true,
    data: {
      order: orderResult.data,
      shipping: shippingResult.success ? shippingResult.data : null
    }
  };
}

/**
 * 注文サマリーを取得（Workspace Studio用）
 * 
 * 指定期間の注文統計を返します。
 * 
 * @param {number} days - 過去何日分を集計するか（デフォルト: 7）
 * @returns {Object} 注文サマリー
 */
function plentyGetOrderSummary(days) {
  days = days || 7;
  
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  
  const result = plentySearchOrders({
    createdAtFrom: fromDate.toISOString(),
    itemsPerPage: 250
  });
  
  if (!result.success) {
    return result;
  }
  
  const orders = result.data.entries || result.data || [];
  
  // 統計を計算
  var totalOrders = orders.length;
  var totalAmount = 0;
  var statusCounts = {};
  
  orders.forEach(function(order) {
    // 合計金額
    if (order.amounts && order.amounts.length > 0) {
      totalAmount += parseFloat(order.amounts[0].grossTotal || 0);
    }
    
    // ステータス別カウント
    var status = order.statusId || 'unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  
  return {
    success: true,
    data: {
      period: {
        from: fromDate.toISOString(),
        to: new Date().toISOString(),
        days: days
      },
      totalOrders: totalOrders,
      totalAmount: totalAmount.toFixed(2),
      statusBreakdown: statusCounts,
      averageOrderValue: totalOrders > 0 ? (totalAmount / totalOrders).toFixed(2) : '0.00'
    }
  };
}

/**
 * 注文ステータスを日本語で取得
 * 
 * @param {number} statusId - ステータスID
 * @returns {string} ステータス名（日本語）
 */
function plentyGetOrderStatusName(statusId) {
  var statusNames = {
    1: '未完了',
    3: '入金待ち',
    5: '入金済み',
    6: '発送準備完了',
    7: '発送済み',
    8: '完了',
    8.1: 'キャンセル',
    9: '返品'
  };
  
  return statusNames[statusId] || 'ステータス ' + statusId;
}
