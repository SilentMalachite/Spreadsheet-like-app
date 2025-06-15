# Excel-like Spreadsheet - Electron Desktop App

## 概要

このプロジェクトは、React + Electronで構築されたローカル動作のExcelライクなデスクトップアプリケーションです。添付されたHTMLファイルを参考に、プロフェッショナルなスプレッドシート機能を実現しています。

## 主要機能

### 基本機能
- ✅ セルの編集・選択・ナビゲーション
- ✅ 数式評価エンジン（SUM、AVERAGE、MAX、MIN、COUNT、IF関数）
- ✅ セルの書式設定（背景色、文字色、フォントスタイル）
- ✅ アンドゥ・リドゥ機能
- ✅ コピー・ペースト機能

### ファイル操作
- ✅ JSON形式での保存・読み込み
- ✅ CSV形式でのエクスポート
- ✅ ネイティブファイルダイアログ（Electron）
- ✅ ローカルストレージでの自動保存

### UI/UX
- ✅ プロフェッショナルなスプレッドシートインターフェース
- ✅ ツールバー（ファイル操作、編集、書式設定）
- ✅ 数式バー
- ✅ コンテキストメニュー（右クリック）
- ✅ ステータスバー
- ✅ キーボードショートカット

### デスクトップアプリ機能
- ✅ Electronメインプロセス・レンダラープロセス分離
- ✅ ネイティブメニューバー
- ✅ ファイルダイアログ統合
- ✅ セキュアなIPC通信

## 技術スタック

### フロントエンド
- React 18 + TypeScript
- Vite（開発サーバー）
- Tailwind CSS + shadcn/ui
- Radix UI プリミティブ

### デスクトップアプリ
- Electron
- Node.js 20
- IPC通信（contextBridge経由）

### 開発・ビルド
- TypeScript
- ESBuild
- Electron Builder

## 開発環境セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 開発サーバーの起動
```bash
# Webアプリとして起動
npm run dev

# Electronアプリとして起動（推奨）
node start-electron.js
```

### 3. ビルド
```bash
# プロダクションビルド
npm run build

# Electronアプリのパッケージング
npm run electron:build
```

## ファイル構造

```
project/
├── electron/                 # Electronメインプロセス
│   ├── main.js              # メインプロセス
│   └── preload.js           # プリロードスクリプト
├── client/                  # Reactアプリケーション
│   ├── src/
│   │   ├── components/      # UIコンポーネント
│   │   ├── hooks/           # カスタムフック
│   │   ├── lib/             # ユーティリティ
│   │   └── pages/           # ページコンポーネント
│   └── index.html
├── shared/                  # 共有スキーマ
│   └── schema.ts
├── electron-builder.json    # Electronビルド設定
└── start-electron.js        # 開発用起動スクリプト
```

## 主要機能の詳細

### スプレッドシート機能
- **セル編集**: ダブルクリックまたはEnterキーで編集モード
- **数式**: =SUM(A1:A5)のような数式をサポート
- **書式設定**: 背景色、文字色、太字、斜体、下線
- **ナビゲーション**: 矢印キー、Tab、Enter

### ファイル操作
- **新規作成**: Ctrl+N
- **開く**: Ctrl+O（ネイティブダイアログ）
- **保存**: Ctrl+S（JSON形式）
- **CSVエクスポート**: メニューから実行

### キーボードショートカット
- `Ctrl+N`: 新規ファイル
- `Ctrl+O`: ファイルを開く
- `Ctrl+S`: ファイル保存
- `Ctrl+Z`: 元に戻す
- `Ctrl+Y`: やり直し
- `Ctrl+C`: コピー
- `Ctrl+V`: 貼り付け

## セキュリティ

- Context Isolation有効
- Node Integration無効
- プリロードスクリプトによる安全なAPI公開
- 外部URL読み込み防止

## 今後の拡張予定

- より多くの数式関数
- グラフ・チャート機能
- 印刷機能
- テーマ切り替え
- 複数シート機能