/**
 * plentyONE API Configuration Helper
 * 
 * 初期設定・テスト用のヘルパー関数
 */

// =============================================================================
// 初期設定
// =============================================================================

/**
 * スクリプトプロパティを設定する
 * 
 * ⚠️ 初回のみ実行してください
 * ⚠️ パスワードはGASエディタのログに残らないよう注意
 * 
 * この関数を直接編集して実行するか、
 * setupPlentyOneCredentials() を呼び出してください。
 */
function setupPlentyOneConfig() {
  var props = PropertiesService.getScriptProperties();
  
  // ここを編集してください
  props.setProperties({
    'PLENTYONE_BASE_URL': 'https://your-shop.plentymarkets-cloud01.com',
    'PLENTYONE_USERNAME': 'your_api_username',
    'PLENTYONE_PASSWORD': 'your_api_password'
  });
  
  Logger.log('設定が完了しました。');
  Logger.log('BASE_URL: ' + props.getProperty('PLENTYONE_BASE_URL'));
  Logger.log('USERNAME: ' + props.getProperty('PLENTYONE_USERNAME'));
  Logger.log('PASSWORD: [設定済み]');
}

/**
 * 現在の設定を確認する（パスワードは非表示）
 */
function checkPlentyOneConfig() {
  var props = PropertiesService.getScriptProperties();
  
  var baseUrl = props.getProperty('PLENTYONE_BASE_URL');
  var username = props.getProperty('PLENTYONE_USERNAME');
  var password = props.getProperty('PLENTYONE_PASSWORD');
  
  Logger.log('=== plentyONE API 設定 ===');
  Logger.log('BASE_URL: ' + (baseUrl || '未設定'));
  Logger.log('USERNAME: ' + (username || '未設定'));
  Logger.log('PASSWORD: ' + (password ? '[設定済み]' : '未設定'));
  
  // 設定状態を返す
  return {
    configured: !!(baseUrl && username && password),
    baseUrl: baseUrl,
    username: username,
    hasPassword: !!password
  };
}

/**
 * 設定をクリアする
 */
function clearPlentyOneConfig() {
  var props = PropertiesService.getScriptProperties();
  props.deleteProperty('PLENTYONE_BASE_URL');
  props.deleteProperty('PLENTYONE_USERNAME');
  props.deleteProperty('PLENTYONE_PASSWORD');
  
  // トークンキャッシュもクリア
  clearTokens_();
  
  Logger.log('設定をクリアしました。');
}

// =============================================================================
// テスト関数
// =============================================================================

/**
 * 接続テスト
 * 
 * ログインして認証ユーザー情報を取得し、ログアウトします。
 */
function testPlentyOneConnection() {
  Logger.log('=== plentyONE 接続テスト ===');
  
  // 1. ログイン
  Logger.log('1. ログイン中...');
  var loginResult = plentyLogin();
  Logger.log(JSON.stringify(loginResult, null, 2));
  
  if (!loginResult.success) {
    Logger.log('❌ ログインに失敗しました');
    return;
  }
  Logger.log('✅ ログイン成功');
  
  // 2. ユーザー情報取得
  Logger.log('2. ユーザー情報を取得中...');
  var userResult = plentyGetAuthorizedUser();
  Logger.log(JSON.stringify(userResult, null, 2));
  
  if (userResult.success) {
    Logger.log('✅ ユーザー情報取得成功');
  }
  
  // 3. 商品を1件取得
  Logger.log('3. 商品情報を取得中...');
  var itemsResult = plentySearchItems({ itemsPerPage: 1 });
  if (itemsResult.success) {
    Logger.log('✅ 商品取得成功: ' + JSON.stringify(itemsResult.data).substring(0, 200) + '...');
  }
  
  // 4. ログアウト
  Logger.log('4. ログアウト中...');
  var logoutResult = plentyLogout();
  Logger.log('✅ ログアウト完了');
  
  Logger.log('=== テスト完了 ===');
}

/**
 * 顧客検索テスト
 */
function testContactSearch() {
  plentyLogin();
  
  Logger.log('=== 顧客検索テスト ===');
  
  // 顧客一覧（最初の5件）
  var result = plentyListContacts({ itemsPerPage: 5 });
  Logger.log('顧客一覧: ' + JSON.stringify(result, null, 2));
  
  plentyLogout();
}

/**
 * 注文検索テスト
 */
function testOrderSearch() {
  plentyLogin();
  
  Logger.log('=== 注文検索テスト ===');
  
  // 最近の注文
  var result = plentyGetRecentOrders(7);
  Logger.log('最近の注文: ' + JSON.stringify(result, null, 2));
  
  plentyLogout();
}

/**
 * 在庫検索テスト
 */
function testStockSearch() {
  plentyLogin();
  
  Logger.log('=== 在庫検索テスト ===');
  
  // 倉庫一覧
  var warehousesResult = plentyListWarehouses();
  Logger.log('倉庫一覧: ' + JSON.stringify(warehousesResult, null, 2));
  
  // 在庫一覧（最初の5件）
  var stockResult = plentyListStock({ itemsPerPage: 5 });
  Logger.log('在庫一覧: ' + JSON.stringify(stockResult, null, 2));
  
  plentyLogout();
}

// =============================================================================
// Workspace Studio用テスト
// =============================================================================

/**
 * Workspace Studio向け関数のテスト
 * 
 * エージェントが呼び出す関数と同じインターフェースでテストします。
 */
function testWorkspaceStudioFunctions() {
  plentyLogin();
  
  Logger.log('=== Workspace Studio関数テスト ===');
  
  // 顧客検索
  Logger.log('plentySearchContact("12345"):');
  Logger.log(JSON.stringify(plentySearchContact('12345'), null, 2));
  
  // 商品検索
  Logger.log('plentySearchProduct("Tabi"):');
  Logger.log(JSON.stringify(plentySearchProduct('Tabi'), null, 2));
  
  // 注文検索
  Logger.log('plentySearchOrder("today"):');
  Logger.log(JSON.stringify(plentySearchOrder('today'), null, 2));
  
  // 在庫検索
  Logger.log('plentySearchStock("1234"):');
  Logger.log(JSON.stringify(plentySearchStock('1234'), null, 2));
  
  // 注文サマリー
  Logger.log('plentyGetOrderSummary(7):');
  Logger.log(JSON.stringify(plentyGetOrderSummary(7), null, 2));
  
  plentyLogout();
  
  Logger.log('=== テスト完了 ===');
}

// =============================================================================
// デバッグ用
// =============================================================================

/**
 * 現在のトークン状態を確認
 */
function debugCheckTokens() {
  var tokens = getStoredTokens_();
  
  if (tokens) {
    Logger.log('トークンあり:');
    Logger.log('- accessToken: ' + tokens.accessToken.substring(0, 20) + '...');
    Logger.log('- refreshToken: ' + (tokens.refreshToken ? tokens.refreshToken.substring(0, 20) + '...' : 'なし'));
  } else {
    Logger.log('トークンなし（未ログイン）');
  }
}
