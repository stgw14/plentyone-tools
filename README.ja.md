# plentyONE Tools

plentyONE ERPシステムと連携するためのツール・クライアント集です。

🇺🇸 [English README](README.md)

## 📁 構成

```
plentyone-tools/
├── mcp/          # MCP Server（Claude Desktop / AI用）
├── gas/          # Google Apps Script（Workspace Studio用）
└── docs/         # ドキュメント・参考資料
    ├── openapi/  # plentyONE REST API OpenAPI仕様
    └── postman/  # Postmanコレクション・環境ファイル
```

## 🔧 ツール一覧

### MCP Server (`mcp/`)

Claude DesktopやMCP対応AIアシスタントからplentyONE APIを利用するためのサーバー。

**機能（25ツール）:**

| カテゴリ | ツール |
|----------|--------|
| 認証 | ログイン、ログアウト、トークン更新、認証ユーザー取得 |
| 顧客 | 一覧取得、ID検索、住所取得、注文履歴取得 |
| 商品 | 検索、ID検索、バリエーション一覧、バリエーション詳細、バーコード一覧 |
| 注文 | 検索、ID検索、明細取得、住所取得、伝票取得、配送情報取得 |
| 在庫 | 一覧取得、倉庫別在庫、倉庫一覧、倉庫詳細、棚番一覧、移動履歴 |

```bash
cd mcp
npm install
npm run build
```

詳細: [mcp/README.ja.md](mcp/README.ja.md)

### Google Apps Script (`gas/`)

Google Apps ScriptからplentyONE APIを利用するためのクライアント。
Google Workspace Studioのエージェントから呼び出すことを想定。

**機能:** MCP Serverと同等 + Workspace Studio向け簡易関数

詳細: [gas/README.ja.md](gas/README.ja.md)

## 📚 ドキュメント (`docs/`)

### OpenAPI仕様 (`docs/openapi/`)

plentyONE REST API v2 のOpenAPI 3.0仕様ファイル。
MCP ServerおよびGASクライアントの実装ベースとして使用。

**入手元:** [plentymarkets/api-doc](https://github.com/plentymarkets/api-doc)（plentyONE公式リポジトリ）

### Postmanコレクション (`docs/postman/`)

plentyONE REST APIのテスト用Postmanコレクションと環境ファイル。

## 🚀 クイックスタート

### 前提条件

- Node.js 18+（MCP Server用）
- [clasp](https://github.com/google/clasp)（Google Apps Script用）

### Option 1: MCP Server（Claude Code / Claude Desktop）

```bash
cd mcp
npm install
npm run build

# Claude Code用
claude mcp add plentyone \
  -e PLENTYONE_BASE_URL=https://your-shop.plentymarkets-cloud01.com \
  -e PLENTYONE_USERNAME=your_username \
  -e PLENTYONE_PASSWORD=your_password \
  -- node /path/to/plentyone-tools/mcp/dist/index.js

# Claude Desktop用
# mcp/claude_desktop_config.example.json を参照
```

### Option 2: Google Apps Script（Workspace Studio）

```bash
# claspをグローバルインストール
npm install -g @google/clasp

# Googleにログイン
clasp login

# GASプロジェクト作成
cd gas
cp .clasp.json.example .clasp.json
clasp create --title "plentyONE API Client" --rootDir ./src

# コードをpush
clasp push

# GASエディタを開いて認証情報を設定
clasp open
```

## ⚙️ 環境変数 / 設定

### plentyONE API認証情報

| 変数名 | 説明 |
|--------|------|
| `PLENTYONE_BASE_URL` | plentyONEのベースURL（例: `https://xxx.plentymarkets-cloud01.com`） |
| `PLENTYONE_USERNAME` | APIユーザー名 |
| `PLENTYONE_PASSWORD` | APIパスワード |

## 🔗 関連リソース

- [plentyONE REST APIドキュメント](https://developers.plentymarkets.com/en-gb/plentymarkets-rest-api/index.html)
- [plentymarkets/api-doc](https://github.com/plentymarkets/api-doc) - 公式OpenAPI仕様
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP仕様
- [Google clasp](https://github.com/google/clasp) - Google Apps Script CLI

## 📝 ライセンス

Internal use only - Knitido GmbH
