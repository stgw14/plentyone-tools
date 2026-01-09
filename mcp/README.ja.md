# plentyONE MCP Server

Claude DesktopやMCP対応AIアシスタントからplentyONE ERPのAPIを利用するためのMCPサーバーです。

🇺🇸 [English README](README.md)

## 🚀 クイックスタート

### インストール

```bash
cd mcp
npm install
npm run build
```

### Claude Code設定

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

### Claude Desktop設定

Claude Desktopの設定ファイルに追加:

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

設定例は `claude_desktop_config.example.json` を参照してください。

## 🔧 利用可能なツール（全25ツール）

### 認証（4ツール）

| ツール | 説明 |
|--------|------|
| `plenty_login` | plentyONEにログイン |
| `plenty_logout` | ログアウト・セッションクリア |
| `plenty_refresh_token` | アクセストークンを更新 |
| `plenty_get_authorized_user` | 現在のユーザー情報を取得 |

### 顧客（4ツール）

| ツール | 説明 |
|--------|------|
| `plenty_list_contacts` | 顧客一覧を取得（メール、名前、タイプ、日付でフィルタ） |
| `plenty_get_contact` | ID指定で顧客詳細を取得（関連データ含む） |
| `plenty_get_contact_addresses` | 顧客の住所一覧を取得 |
| `plenty_get_contact_orders` | 顧客の注文履歴を取得 |

### 商品（5ツール）

| ツール | 説明 |
|--------|------|
| `plenty_search_items` | 商品を検索（名前、IDでフィルタ、ページネーション対応） |
| `plenty_get_item` | ID指定で商品詳細を取得 |
| `plenty_list_variations` | 商品のバリエーション一覧を取得 |
| `plenty_get_variation` | 商品ID・バリエーションID指定で詳細を取得 |
| `plenty_list_barcodes` | バーコード一覧を取得 |

### 注文（6ツール）

| ツール | 説明 |
|--------|------|
| `plenty_search_orders` | 注文を検索（ステータス、日付、plentyIdでフィルタ） |
| `plenty_get_order` | ID指定で注文詳細を取得（関連データ含む） |
| `plenty_get_order_items` | 注文明細を取得 |
| `plenty_get_order_addresses` | 請求先・配送先住所を取得 |
| `plenty_get_order_documents` | 請求書、納品書等の伝票を取得 |
| `plenty_get_order_shipping` | 配送パッケージ・追跡情報を取得 |

### 在庫（6ツール）

| ツール | 説明 |
|--------|------|
| `plenty_list_stock` | 在庫一覧を取得（フィルタ対応） |
| `plenty_get_warehouse_stock` | 指定倉庫の在庫を取得 |
| `plenty_list_warehouses` | 倉庫一覧を取得 |
| `plenty_get_warehouse` | ID指定で倉庫詳細を取得 |
| `plenty_list_warehouse_locations` | 倉庫内の棚番一覧を取得 |
| `plenty_get_stock_movements` | 在庫移動履歴を取得 |

## 📖 使用例

設定後、Claudeに以下のように質問できます:

- 「plentyONEにログインして、今日の注文を見せて」
- 「customer@example.com のメールアドレスで顧客を検索して」
- 「バリエーション1234の在庫数は？」
- 「過去7日間の注文を表示して」
- 「倉庫一覧を教えて」

## 🔧 開発

### ビルド

```bash
npm run build
```

### ウォッチモード

```bash
npm run dev
```

### プロジェクト構成

```
mcp/
├── src/
│   └── index.ts           # メインサーバー実装
├── dist/                   # コンパイル出力
├── package.json
├── tsconfig.json
└── claude_desktop_config.example.json
```

## ⚙️ 環境変数

| 変数 | 必須 | 説明 |
|------|------|------|
| `PLENTYONE_BASE_URL` | Yes | plentyONE APIのベースURL |
| `PLENTYONE_USERNAME` | Yes | APIユーザー名 |
| `PLENTYONE_PASSWORD` | Yes | APIパスワード |

## 🔒 セキュリティ

- アクセストークンはメモリ内に保存され、セッション終了時に破棄されます
- 401レスポンス時は自動的にトークンリフレッシュを試みます
- 認証情報をバージョン管理にコミットしないでください

## 📝 ライセンス

Internal use only - Knitido GmbH
