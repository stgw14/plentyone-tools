# plentyONE MCP Server

Claude Desktop、Claude Code、およびその他のMCP対応AIアシスタントからplentyONE ERP APIにアクセスするためのModel Context Protocol (MCP) サーバー。

🇺🇸 [English README](README.md)

## 機能

**50ツール** - 15カテゴリで包括的なplentyONE ERP統合を実現。

| カテゴリ | ツール数 | 説明 |
|----------|----------|------|
| Authentication | 4 | ログイン、ログアウト、トークン更新、ユーザー情報 |
| Contacts | 4 | 一覧、取得、住所、注文履歴 |
| Items | 6 | 検索、取得、バリエーション、バーコードタイプ、バリエーションバーコード |
| Orders | 6 | 検索、取得、明細、住所、書類、配送 |
| Stock | 4 | 一覧、倉庫在庫、倉庫一覧 |
| Categories | 3 | 一覧、取得、ブランチ |
| Payments | 4 | 一覧、取得、支払い方法、プロパティ |
| Attributes | 3 | 一覧、取得、値（サイズ、色など） |
| Sales Prices | 2 | 価格設定の一覧、取得 |
| Properties | 3 | 一覧、取得、グループ |
| Tags | 2 | 一覧、取得 |
| VAT | 1 | 消費税設定一覧 |
| Accounts | 4 | 一覧、取得、顧客クラス、コンタクトタイプ |
| Order Meta | 2 | ステータス、リファラー |
| Countries | 1 | 国一覧 |
| Item Images | 1 | 商品画像一覧 |

## クイックスタート

### インストール

```bash
cd mcp
npm install
npm run build
```

### Claude Code 設定

`claude mcp add` コマンドでMCPサーバーを追加:

```bash
claude mcp add plentyone \
  -e PLENTYONE_BASE_URL=https://your-shop.plentymarkets-cloud01.com \
  -e PLENTYONE_USERNAME=your_api_username \
  -e PLENTYONE_PASSWORD=your_api_password \
  -- node /path/to/plentyone-tools/mcp/dist/index.js
```

インストール確認:

```bash
claude mcp list
```

### Claude Desktop 設定

設定ファイルに追加:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "plentyone": {
      "command": "node",
      "args": ["/path/to/plentyone-tools/mcp/dist/index.js"],
      "env": {
        "PLENTYONE_BASE_URL": "https://your-shop.plentymarkets-cloud01.com",
        "PLENTYONE_USERNAME": "your_api_username",
        "PLENTYONE_PASSWORD": "your_api_password"
      }
    }
  }
}
```

### Gemini CLI 設定

`~/.gemini/settings.json` に追加:

```json
{
  "mcpServers": {
    "plentyone": {
      "command": "node",
      "args": ["/path/to/plentyone-tools/mcp/dist/index.js"],
      "env": {
        "PLENTYONE_BASE_URL": "https://your-shop.plentymarkets-cloud01.com",
        "PLENTYONE_USERNAME": "your_api_username",
        "PLENTYONE_PASSWORD": "your_api_password"
      }
    }
  }
}
```

## 使用例

```
ユーザー: 「山田」という名前のコンタクトを検索して
アシスタント: [plenty_list_contacts を name="山田" で呼び出し]

ユーザー: 倉庫1の在庫を見せて
アシスタント: [plenty_get_warehouse_stock を warehouseId=1 で呼び出し]

ユーザー: 今日の注文は？
アシスタント: [plenty_search_orders を createdAtFrom="2026-01-11" で呼び出し]

ユーザー: 全ての支払い方法を表示
アシスタント: [plenty_list_payment_methods を呼び出し]

ユーザー: サイズと色の属性を見せて
アシスタント: [plenty_list_attributes を呼び出し]
```

## 変更履歴

### v1.2.0 (2026-01-11)
- 17の新ツール追加: Attributes, Sales Prices, Properties, Tags, VAT, Accounts, Order Meta, Countries, Item Images
- 機能しない3ツールを削除 (shipping_profiles, warehouse_locations, stock_movements)
- **合計: 50ツール** (v1.1.0: 33 → v1.2.0: 50)

### v1.1.0
- Categories (3ツール), Payments (4ツール) 追加
- モジュラーアーキテクチャへのリファクタリング
- **合計: 33ツール** (v1.0.0: 25 → v1.1.0: 33)

### v1.0.0
- 初回リリース
- Authentication, Contacts, Items, Orders, Stock
- **合計: 25ツール**

## 開発

```bash
# ウォッチモード
npm run dev

# ビルド
npm run build

# 実行
npm start
```

## ライセンス

MIT
