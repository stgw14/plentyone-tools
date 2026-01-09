# plentyONE API Client for Google Apps Script

plentyONE ERPのAPIをGoogle Apps Scriptから利用するためのクライアントライブラリです。
Google Workspace Studioのエージェントから呼び出すことを想定して設計されています。

🇺🇸 [English README](README.md)

## 📁 ファイル構成

```
gas/
├── src/
│   ├── PlentyOneApi.gs    # 認証・HTTPクライアント基盤
│   ├── ContactsApi.gs     # 顧客（Contacts）API
│   ├── ItemsApi.gs        # 商品（Items）API
│   ├── OrdersApi.gs       # 注文（Orders）API
│   ├── StockApi.gs        # 在庫（Stock）API
│   └── Config.gs          # 設定・テスト用ヘルパー
├── appsscript.json        # GASマニフェスト
├── .clasp.json.example    # clasp設定テンプレート
├── .claspignore           # clasp除外設定
└── README.ja.md
```

## 🚀 セットアップ手順

### 前提条件

- Node.js 18+ インストール済み
- Apps Script APIにアクセス可能なGoogleアカウント

### 1. claspのインストール

[clasp](https://github.com/google/clasp) はGoogleが公式に提供するApps Script開発用CLIです。

```bash
npm install -g @google/clasp
```

### 2. Apps Script APIを有効化

1. [Google Apps Script設定](https://script.google.com/home/usersettings) にアクセス
2. 「Google Apps Script API」をオンにする

### 3. Googleにログイン

```bash
clasp login
```

ブラウザが開き、Google認証が求められます。

### 4. GASプロジェクトを作成

```bash
cd gas

# Option A: 新規プロジェクト作成
clasp create-script --title "plentyONE API Client" --rootDir ./src

# Option B: 既存プロジェクトをクローン（既にGASプロジェクトがある場合）
# cp .clasp.json.example .clasp.json
# .clasp.json を編集してscriptIdを設定
```

### 5. コードをpush

```bash
clasp push
```

確認:
```bash
clasp open-script  # ブラウザでGASエディタを開く
```

### 6. 認証情報を設定

GASエディタで:

1. `Config.gs` を開く
2. `setupPlentyOneConfig()` 関数を編集:

```javascript
props.setProperties({
  'PLENTYONE_BASE_URL': 'https://your-shop.plentymarkets-cloud01.com',
  'PLENTYONE_USERNAME': 'your_api_username',
  'PLENTYONE_PASSWORD': 'your_api_password'
});
```

3. `setupPlentyOneConfig()` を実行（1回のみ）
4. `checkPlentyOneConfig()` を実行して確認

### 7. 接続テスト

GASエディタで `testPlentyOneConnection()` を実行。

期待される出力:
```
✅ ログイン成功
✅ ユーザー情報取得成功
✅ 商品取得成功
✅ ログアウト完了
```

## 📖 利用可能な関数

### 認証

| 関数名 | 説明 |
|--------|------|
| `plentyLogin()` | ログイン |
| `plentyLogout()` | ログアウト |
| `plentyCheckAuth()` | 認証状態を確認 |
| `plentyGetAuthorizedUser()` | 現在のユーザー情報を取得 |

### 顧客（Contacts）

| 関数名 | 説明 | WS対応 |
|--------|------|:---:|
| `plentyListContacts(params)` | 顧客一覧を取得 | |
| `plentyGetContact(contactId)` | 顧客詳細を取得 | |
| `plentyGetContactAddresses(contactId)` | 顧客の住所一覧 | |
| `plentyGetContactOrders(contactId)` | 顧客の注文履歴 | |
| `plentySearchContact(query)` | 顧客を検索（ID/メール/名前を自動判定） | ⭐ |
| `plentyGetContactSummary(contactId)` | 顧客サマリーを取得 | ⭐ |

### 商品（Items）

| 関数名 | 説明 | WS対応 |
|--------|------|:---:|
| `plentySearchItems(params)` | 商品を検索 | |
| `plentyGetItem(itemId)` | 商品詳細を取得 | |
| `plentyListVariations(itemId)` | バリエーション一覧 | |
| `plentyGetVariation(itemId, variationId)` | バリエーション詳細 | |
| `plentyListBarcodes()` | バーコード一覧 | |
| `plentySearchProduct(query, lang)` | 商品を検索（ID/名前を自動判定） | ⭐ |
| `plentyGetProductDetail(itemId, lang)` | 商品の全情報を取得 | ⭐ |

### 注文（Orders）

| 関数名 | 説明 | WS対応 |
|--------|------|:---:|
| `plentySearchOrders(params)` | 注文を検索 | |
| `plentyGetOrder(orderId)` | 注文詳細を取得 | |
| `plentyGetOrderItems(orderId)` | 注文明細 | |
| `plentyGetOrderAddresses(orderId)` | 注文の住所 | |
| `plentyGetOrderDocuments(orderId)` | 注文の伝票 | |
| `plentyGetOrderShipping(orderId)` | 配送情報 | |
| `plentyGetTodayOrders()` | 今日の注文 | |
| `plentyGetRecentOrders(days)` | 最近の注文 | |
| `plentyGetPendingShipmentOrders()` | 発送待ちの注文 | |
| `plentySearchOrder(query)` | 注文を検索（ID/日付/キーワード） | ⭐ |
| `plentyGetOrderDetail(orderId)` | 注文の全情報を取得 | ⭐ |
| `plentyGetOrderSummary(days)` | 注文統計を取得 | ⭐ |

### 在庫（Stock）

| 関数名 | 説明 | WS対応 |
|--------|------|:---:|
| `plentyListStock(params)` | 在庫一覧 | |
| `plentyGetVariationStock(variationId)` | バリエーションの在庫 | |
| `plentyListWarehouses()` | 倉庫一覧 | |
| `plentyGetWarehouse(warehouseId)` | 倉庫詳細 | |
| `plentyGetWarehouseStock(warehouseId)` | 倉庫の在庫一覧 | |
| `plentyListWarehouseLocations(warehouseId)` | 棚番一覧 | |
| `plentyGetStockMovements(params)` | 在庫移動履歴 | |
| `plentySearchStock(query)` | 在庫を検索 | ⭐ |
| `plentyGetStockSummary()` | 在庫サマリー | ⭐ |
| `plentyGetLowStockAlert(threshold)` | 低在庫アラート | ⭐ |
| `plentyGetTodayStockMovements()` | 今日の在庫移動 | ⭐ |

※ WS対応 = Workspace Studio向け簡易関数（⭐マーク）

## 🤖 Workspace Studio連携

⭐マークの付いた関数はWorkspace Studioのカスタムステップとして登録してください。
自然言語クエリを受け付け、適切な形式でデータを返します。

### 推奨プロンプト

```
あなたはplentyONE ERPのデータアシスタントです。
ユーザーからの質問に対して、登録されたカスタムステップ（Google Apps Script関数）を
呼び出してERPデータを取得し、わかりやすく回答してください。

対応可能な質問例:
- 「今日の注文は何件？」→ plentyGetTodayOrders()
- 「注文番号12345の詳細を教えて」→ plentyGetOrderDetail(12345)
- 「田中さんの顧客情報」→ plentySearchContact("田中")
- 「Tabi Sneakerの在庫は？」→ plentySearchStock("Tabi Sneaker")
- 「発送待ちの注文一覧」→ plentyGetPendingShipmentOrders()
- 「今週の注文サマリー」→ plentyGetOrderSummary(7)
```

## 🔧 開発

### GASの変更をローカルに取得

```bash
clasp pull
```

### ローカルの変更をGASに反映

```bash
clasp push
```

### GASエディタを開く

```bash
clasp open-script
```

## 📝 ライセンス

Internal use only - Knitido GmbH
