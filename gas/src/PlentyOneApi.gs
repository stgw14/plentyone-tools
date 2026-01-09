/**
 * plentyONE API Client for Google Apps Script
 * 
 * Workspace Studio対応のplentyONE ERPクライアント
 * 
 * 初期設定:
 * 1. スクリプトプロパティに以下を設定:
 *    - PLENTYONE_BASE_URL: https://your-shop.plentymarkets-cloud01.com
 *    - PLENTYONE_USERNAME: APIユーザー名
 *    - PLENTYONE_PASSWORD: APIパスワード
 * 
 * @author Knitido GmbH
 * @version 1.0.0
 */

// =============================================================================
// 定数・設定
// =============================================================================

/**
 * スクリプトプロパティから設定を取得
 */
function getConfig_() {
  const props = PropertiesService.getScriptProperties();
  return {
    baseUrl: props.getProperty('PLENTYONE_BASE_URL') || '',
    username: props.getProperty('PLENTYONE_USERNAME') || '',
    password: props.getProperty('PLENTYONE_PASSWORD') || ''
  };
}

/**
 * キャッシュからトークンを取得
 */
function getStoredTokens_() {
  const cache = CacheService.getScriptCache();
  const tokensJson = cache.get('PLENTYONE_TOKENS');
  if (tokensJson) {
    try {
      return JSON.parse(tokensJson);
    } catch (e) {
      return null;
    }
  }
  return null;
}

/**
 * トークンをキャッシュに保存（最大6時間）
 */
function storeTokens_(tokens) {
  const cache = CacheService.getScriptCache();
  cache.put('PLENTYONE_TOKENS', JSON.stringify(tokens), 21600); // 6時間
}

/**
 * トークンをクリア
 */
function clearTokens_() {
  const cache = CacheService.getScriptCache();
  cache.remove('PLENTYONE_TOKENS');
}

// =============================================================================
// HTTPクライアント
// =============================================================================

/**
 * plentyONE APIにリクエストを送信
 * @param {string} endpoint - APIエンドポイント（例: /rest/items）
 * @param {Object} options - オプション
 * @param {string} options.method - HTTPメソッド（デフォルト: GET）
 * @param {Object} options.body - リクエストボディ
 * @param {Object} options.query - クエリパラメータ
 * @param {boolean} options.requiresAuth - 認証が必要か（デフォルト: true）
 * @returns {Object} APIレスポンス
 */
function makeRequest_(endpoint, options) {
  options = options || {};
  const method = options.method || 'GET';
  const body = options.body;
  const query = options.query || {};
  const requiresAuth = options.requiresAuth !== false;
  
  const config = getConfig_();
  
  // URLを構築
  let url = config.baseUrl + endpoint;
  
  // クエリパラメータを追加
  const queryParams = [];
  for (const key in query) {
    if (query[key] !== undefined && query[key] !== null && query[key] !== '') {
      queryParams.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]));
    }
  }
  if (queryParams.length > 0) {
    url += '?' + queryParams.join('&');
  }
  
  // ヘッダーを構築
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  
  // 認証トークンを追加
  if (requiresAuth) {
    const tokens = getStoredTokens_();
    if (!tokens) {
      return {
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: '認証されていません。先にplentyLogin()を実行してください。'
        }
      };
    }
    headers['Authorization'] = 'Bearer ' + tokens.accessToken;
  }
  
  // リクエストオプション
  const fetchOptions = {
    method: method,
    headers: headers,
    muteHttpExceptions: true
  };
  
  if (body) {
    fetchOptions.payload = JSON.stringify(body);
  }
  
  try {
    const response = UrlFetchApp.fetch(url, fetchOptions);
    const statusCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    // 401エラーの場合、トークンリフレッシュを試みる
    if (statusCode === 401 && requiresAuth) {
      const refreshResult = refreshAccessToken_();
      if (refreshResult.success) {
        // リトライ
        const newTokens = getStoredTokens_();
        headers['Authorization'] = 'Bearer ' + newTokens.accessToken;
        fetchOptions.headers = headers;
        
        const retryResponse = UrlFetchApp.fetch(url, fetchOptions);
        const retryStatusCode = retryResponse.getResponseCode();
        const retryResponseText = retryResponse.getContentText();
        
        if (retryStatusCode >= 200 && retryStatusCode < 300) {
          return {
            success: true,
            data: JSON.parse(retryResponseText)
          };
        }
      }
      
      // リフレッシュ失敗
      clearTokens_();
      return {
        success: false,
        error: {
          code: 'AUTH_EXPIRED',
          message: '認証の有効期限が切れました。再度plentyLogin()を実行してください。'
        }
      };
    }
    
    // エラーレスポンス
    if (statusCode < 200 || statusCode >= 300) {
      let errorData = {};
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { raw: responseText };
      }
      
      return {
        success: false,
        error: {
          code: 'HTTP_' + statusCode,
          message: 'APIエラー',
          details: errorData
        }
      };
    }
    
    // 成功
    const data = responseText ? JSON.parse(responseText) : {};
    return {
      success: true,
      data: data
    };
    
  } catch (e) {
    return {
      success: false,
      error: {
        code: 'REQUEST_FAILED',
        message: e.message || 'リクエストに失敗しました'
      }
    };
  }
}

/**
 * トークンをリフレッシュ
 */
function refreshAccessToken_() {
  const tokens = getStoredTokens_();
  if (!tokens || !tokens.refreshToken) {
    return {
      success: false,
      error: {
        code: 'NO_REFRESH_TOKEN',
        message: 'リフレッシュトークンがありません'
      }
    };
  }
  
  const config = getConfig_();
  const url = config.baseUrl + '/rest/login/refresh';
  
  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tokens.accessToken
      },
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() === 200) {
      const newTokens = JSON.parse(response.getContentText());
      storeTokens_({
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken || tokens.refreshToken,
        tokenType: newTokens.tokenType || 'Bearer'
      });
      return { success: true };
    }
    
    return { success: false };
  } catch (e) {
    return { success: false, error: { message: e.message } };
  }
}

// =============================================================================
// 認証API（公開関数）
// =============================================================================

/**
 * plentyONEにログイン
 * 
 * @param {string} username - ユーザー名（省略時はスクリプトプロパティを使用）
 * @param {string} password - パスワード（省略時はスクリプトプロパティを使用）
 * @returns {Object} ログイン結果
 * 
 * @example
 * const result = plentyLogin();
 * // { success: true, message: "ログインしました" }
 */
function plentyLogin(username, password) {
  const config = getConfig_();
  username = username || config.username;
  password = password || config.password;
  
  if (!username || !password) {
    return {
      success: false,
      error: {
        code: 'MISSING_CREDENTIALS',
        message: 'ユーザー名とパスワードが必要です。スクリプトプロパティに設定するか、引数で指定してください。'
      }
    };
  }
  
  if (!config.baseUrl) {
    return {
      success: false,
      error: {
        code: 'MISSING_BASE_URL',
        message: 'PLENTYONE_BASE_URLがスクリプトプロパティに設定されていません。'
      }
    };
  }
  
  const result = makeRequest_('/rest/login', {
    method: 'POST',
    body: { username: username, password: password },
    requiresAuth: false
  });
  
  if (result.success && result.data) {
    storeTokens_({
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
      tokenType: result.data.tokenType || 'Bearer'
    });
    
    return {
      success: true,
      message: 'ログインしました'
    };
  }
  
  return result;
}

/**
 * plentyONEからログアウト
 * 
 * @returns {Object} ログアウト結果
 */
function plentyLogout() {
  const result = makeRequest_('/rest/logout', { method: 'POST' });
  clearTokens_();
  
  return {
    success: true,
    message: 'ログアウトしました'
  };
}

/**
 * 現在の認証ユーザー情報を取得
 * 
 * @returns {Object} ユーザー情報
 */
function plentyGetAuthorizedUser() {
  return makeRequest_('/rest/authorized_user');
}

/**
 * 認証状態を確認
 * 
 * @returns {Object} 認証状態
 */
function plentyCheckAuth() {
  const tokens = getStoredTokens_();
  if (!tokens) {
    return {
      authenticated: false,
      message: '未認証'
    };
  }
  
  // 実際にAPIを呼んで確認
  const result = makeRequest_('/rest/authorized_user');
  if (result.success) {
    return {
      authenticated: true,
      user: result.data
    };
  }
  
  return {
    authenticated: false,
    message: '認証が無効です'
  };
}

// =============================================================================
// ユーティリティ関数
// =============================================================================

/**
 * 結果を整形して返す（Workspace Studio向け）
 * @param {Object} result - API結果
 * @returns {string} 整形されたJSON文字列
 */
function formatResult_(result) {
  return JSON.stringify(result, null, 2);
}

/**
 * エラーレスポンスを作成
 * @param {string} code - エラーコード
 * @param {string} message - エラーメッセージ
 * @returns {Object} エラーオブジェクト
 */
function createError_(code, message) {
  return {
    success: false,
    error: {
      code: code,
      message: message
    }
  };
}
