# 🧮 プロ表計算ソフト - React+Electron版

React + Electronで構築された、本格的なExcelライクなデスクトップスプレッドシートアプリケーションです。ローカル環境で動作し、直感的な操作性と高度な数式計算機能を提供します。

![プロ表計算ソフト](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![Electron](https://img.shields.io/badge/Electron-Latest-47848F?style=for-the-badge&logo=electron)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ 主な機能

### 🎯 スプレッドシート基本機能
- **セル編集**: クリック編集、キーボード入力による自動編集開始
- **キーボードナビゲーション**: 矢印キーでのセル移動
- **セル選択**: 単一セル・範囲選択対応
- **セル書式設定**: 太字、斜体、下線、背景色

### 🔢 高度な数式エンジン
- **基本演算**: 四則演算 (+, -, *, /)
- **関数サポート**:
  - `SUM(範囲)` - 合計計算
  - `AVERAGE(範囲)` - 平均計算
  - `MAX(範囲)` - 最大値
  - `MIN(範囲)` - 最小値
  - `COUNT(範囲)` - カウント
  - `IF(条件, 真の値, 偽の値)` - 条件分岐
- **セル参照**: A1, B2などのExcel形式の参照
- **範囲指定**: A1:C3形式の範囲計算

### 📁 ファイル操作
- **新規作成**: 空のスプレッドシート作成
- **保存/読込**: JSON形式でのネイティブ保存
- **CSV エクスポート**: Excel互換のCSV出力
- **ローカルファイル**: Electronの安全なファイルシステムアクセス

### ⌨️ 直感的な操作性
- **自動編集開始**: 文字・数字入力で即座に編集モード
- **キーボードショートカット**:
  - `Enter` / `F2`: 編集開始
  - `Escape`: 編集キャンセル
  - `Delete` / `Backspace`: セル内容削除
  - `Ctrl+C` / `Ctrl+V`: コピー&ペースト
  - `Ctrl+Z` / `Ctrl+Y`: 元に戻す/やり直し

### 🎨 モダンなUI/UX
- **レスポンシブデザイン**: 画面サイズに応じた最適表示
- **ダークモード対応**: システム設定に連動
- **アニメーション**: スムーズな操作フィードバック
- **アクセシビリティ**: キーボードナビゲーション完全対応

## 🚀 インストール・使用方法

### 必要環境
- Node.js 20以降
- npm または yarn

### 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/your-username/spreadsheet-app.git
cd spreadsheet-app

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### Electronアプリの起動

```bash
# Electronアプリの起動
npm run electron

# 本番用ビルド
npm run build
npm run electron:build
```

## 🏗️ 技術アーキテクチャ

### フロントエンド
- **React 18**: モダンなUI構築
- **TypeScript**: 型安全性の確保
- **Tailwind CSS**: 効率的なスタイリング
- **Vite**: 高速な開発環境
- **Radix UI**: アクセシブルなUI コンポーネント

### デスクトップアプリ
- **Electron**: クロスプラットフォーム対応
- **セキュリティ**: Context Isolation、Node Integration無効化
- **IPC通信**: プリロードスクリプトによる安全な通信

### データ管理
- **ローカルストレージ**: ブラウザのlocalStorageを活用
- **ファイルシステム**: Electronの安全なファイルアクセス
- **状態管理**: Reactカスタムフックによる効率的な状態管理

### テスト環境
- **Vitest**: 高速なユニットテスト
- **Testing Library**: UIコンポーネントテスト
- **52件の包括的テストスイート**: 全機能をカバー

## 🧪 テスト

プロジェクトには包括的なテストスイートが含まれています：

```bash
# 全テストの実行
npm test

# 特定のテストファイルの実行
npm test -- client/src/lib/__tests__/formulas.test.ts

# カバレッジレポート付きテスト
npm run test:coverage
```

### テストカバレッジ
- ✅ スプレッドシート基本機能 (9件)
- ✅ 数式エンジン (9件)  
- ✅ 統合テスト (12件)
- ✅ Reactフック (16件)
- ✅ UIコンポーネント (6件)

**合計: 52件のテスト - 100%通過**

## 📦 プロジェクト構造

```
spreadsheet-app/
├── client/                 # Reactフロントエンド
│   ├── src/
│   │   ├── components/    # UIコンポーネント
│   │   ├── hooks/         # カスタムフック
│   │   ├── lib/           # ユーティリティ・エンジン
│   │   ├── pages/         # ページコンポーネント
│   │   └── __tests__/     # テストファイル
├── electron/               # Electronメインプロセス
├── server/                 # Express サーバー（開発用）
├── shared/                 # 共有型定義
└── docs/                   # ドキュメント
```

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！

### 開発に参加する方法

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### 開発ガイドライン

- TypeScriptの型安全性を維持
- 新機能には必ずテストを追加
- コミットメッセージは日本語または英語で明確に
- ESLint・Prettierの設定に従う

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルをご覧ください。

## 🙏 謝辞

- [React](https://reactjs.org/) - UI構築フレームワーク
- [Electron](https://www.electronjs.org/) - デスクトップアプリ開発
- [Tailwind CSS](https://tailwindcss.com/) - CSSフレームワーク
- [Radix UI](https://www.radix-ui.com/) - アクセシブルUIプリミティブ

## 📞 サポート

問題や質問がある場合は、[Issues](https://github.com/your-username/spreadsheet-app/issues) でお気軽にお知らせください。

---

**🎯 高品質・高性能・直感的操作を追求したプロフェッショナルスプレッドシートアプリケーション**

Made with ❤️ by [Your Name]