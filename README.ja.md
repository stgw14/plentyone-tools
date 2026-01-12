# plentyONE Tools

plentyONE ERPシステムと統合するためのツールとクライアントのコレクション。

🇺🇸 [English README](README.md)

## 📁 構成

```
plentyone-tools/
├── mcp/          # MCP Server (Claude Desktop / Claude Code / AIアシスタント用)
├── gas/          # Google Apps Script (Google Workspace用)
└── docs/         # ドキュメント・参考資料
    ├── openapi/  # plentyONE REST API OpenAPI仕様書
    └── postman/  # Postmanコレクション・環境設定
```

## 🔧 ツール

### MCP Server (`mcp/`)

Claude Desktop、Claude Code、およびその他のMCP対応AIアシスタントからplentyONE APIにアクセスするためのModel Context Protocolサーバー。

**機能 (50ツール):**

| カテゴリ | ツール |
|----------|-------|
| Authentication | ログイン、ログアウト、トークン更新、ユーザー情報 |
| Contacts | 一覧、取得、住所、注文履歴 |
| Items | 検索、取得、バリエーション、バーコードタイプ、バリエーションバーコード |
| Orders | 検索、取得、明細、住所、書類、配送 |
| Stock | 一覧、倉庫在庫、倉庫一覧 |
| Categories | 一覧、取得、ブランチ |
| Payments | 一覧、取得、支払い方法、プロパティ |
| Attributes | 一覧、取得、値 |
| Sales Prices | 一覧、取得 |
| Properties | 一覧、取得、グループ |
| Tags | 一覧、取得 |
| VAT | 消費税設定一覧 |
| Accounts | 一覧、取得、顧客クラス、コンタクトタイプ |
| Order Meta | ステータス、リファラー |
| Countries | 国一覧 |
| Item Images | 商品画像一覧 |

```bash
cd mcp
npm install
npm run build
```

詳細は [mcp/README.md](mcp/README.md) を参照。

### Google Apps Script (`gas/`)

Google Workspace Studioエージェント用に設計されたGoogle Apps Script用plentyONE APIクライアント。

**機能:** MCP Serverと同等、加えてWorkspace Studio用のヘルパー関数。

詳細は [gas/README.md](gas/README.md) を参照。

## 📚 ドキュメント (`docs/`)

### OpenAPI仕様書 (`docs/openapi/`)

plentyONE REST API v2のOpenAPI 3.0仕様書。
MCP ServerとGASクライアントの両方の実装ベースとして使用。

**入手元:** [plentymarkets/api-doc](https://github.com/plentymarkets/api-doc) (公式plentyONEリポジトリ)

### Postmanコレクション (`docs/postman/`)

plentyONE REST APIテスト用のPostmanコレクションと環境設定ファイル。

## 🚀 クイックスタート

### 前提条件

- Node.js 18+ (MCP Server用)
- [clasp](https://github.com/google/clasp) (Google Apps Script用)

### オプション1: MCP Server (Claude Desktop / Claude Code)

```bash
cd mcp
npm install
npm run build

# Claude Code:
claude mcp add plentyone \
  -e PLENTYONE_BASE_URL=https://your-shop.plentymarkets-cloud01.com \
  -e PLENTYONE_USERNAME=your_username \
  -e PLENTYONE_PASSWORD=your_password \
  -- node /path/to/mcp/dist/index.js

# Claude Desktop:
# mcp/claude_desktop_config.example.json を参照
```

### オプション2: Google Apps Script (Google Workspace)

```bash
# claspをグローバルインストール
npm install -g @google/clasp

# Google Apps Script APIを有効化:
# https://script.google.com/home/usersettings

# Googleにログイン
clasp login

# GASプロジェクトを作成
cd gas
cp .clasp.json.example .clasp.json
clasp create --title "plentyONE API Client" --rootDir ./src

# コードをGASにプッシュ
clasp push

# GASエディタを開いて認証情報を設定
clasp open
```

## ⚙️ 設定

### plentyONE API認証情報

| 変数 | 説明 |
|------|------|
| `PLENTYONE_BASE_URL` | plentyONEベースURL (例: `https://xxx.plentymarkets-cloud01.com`) |
| `PLENTYONE_USERNAME` | APIユーザー名 |
| `PLENTYONE_PASSWORD` | APIパスワード |

## 🔗 関連リソース

- [plentyONE REST API ドキュメント](https://developers.plentymarkets.com/en-gb/plentymarkets-rest-api/index.html)
- [plentymarkets/api-doc](https://github.com/plentymarkets/api-doc) - 公式OpenAPI仕様書
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP仕様
- [Google clasp](https://github.com/google/clasp) - Google Apps Script用CLI

## 📝 ライセンス

MIT - Knitido GmbH
