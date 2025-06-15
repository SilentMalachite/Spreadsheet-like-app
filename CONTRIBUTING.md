# コントリビューションガイド

プロ表計算ソフトへのコントリビューションをご検討いただき、ありがとうございます！このガイドでは、プロジェクトに貢献するための手順と規則を説明します。

## 🚀 開発環境のセットアップ

### 必要な環境
- Node.js 20以降
- npm または yarn
- Git

### セットアップ手順

```bash
# リポジトリをフォーク後、クローン
git clone https://github.com/your-username/spreadsheet-app.git
cd spreadsheet-app

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 別ターミナルでElectronアプリの起動
npm run electron
```

## 📝 開発ワークフロー

### 1. Issue の確認・作成
- 既存のIssueを確認して重複を避ける
- 新機能や修正の提案は Issue を作成して議論
- バグ報告には再現手順を詳しく記載

### 2. ブランチの作成
```bash
# メインブランチから最新を取得
git checkout main
git pull origin main

# 機能ブランチを作成
git checkout -b feature/your-feature-name
# または
git checkout -b fix/bug-description
```

### 3. 開発・テスト
```bash
# コードの変更後、テストを実行
npm test

# 特定のテストファイルのみ実行
npm test -- path/to/test.ts

# リンターとフォーマッターの実行
npm run lint
npm run format
```

### 4. コミット
```bash
# 変更をステージング
git add .

# コミット（明確なメッセージで）
git commit -m "feat: セル範囲選択機能を追加"
```

### 5. プルリクエスト
```bash
# リモートにプッシュ
git push origin feature/your-feature-name

# GitHubでプルリクエストを作成
```

## 🎯 コントリビューションの種類

### バグ修正
- 既存機能の問題を修正
- テストケースの追加を推奨
- 再現手順を Issue に記載

### 新機能追加
- 新しいスプレッドシート機能の実装
- 数式エンジンの拡張
- UI/UX の改善

### ドキュメント改善
- README やコメントの更新
- API ドキュメントの追加
- チュートリアルの作成

### テスト追加
- カバレッジの向上
- エッジケースのテスト
- パフォーマンステスト

## 📋 コーディング規約

### TypeScript
```typescript
// 型定義を明確に
interface CellProps {
  value: string;
  formula?: string;
  style?: CellStyle;
}

// 関数コンポーネントの型指定
const Cell: React.FC<CellProps> = ({ value, formula, style }) => {
  // ...
};
```

### スタイリング
```tsx
// Tailwind CSS クラスの使用
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800">
  {/* コンテンツ */}
</div>
```

### ファイル命名
- コンポーネント: `PascalCase.tsx`
- ユーティリティ: `camelCase.ts`
- テスト: `*.test.ts` または `*.test.tsx`

## 🧪 テストガイドライン

### テスト種類
1. **ユニットテスト**: 個別関数・コンポーネント
2. **統合テスト**: 複数コンポーネント間の連携
3. **E2Eテスト**: アプリケーション全体の動作

### テスト作成例
```typescript
describe('数式エンジン', () => {
  it('SUM関数が正しく計算される', () => {
    const spreadsheet = createTestSpreadsheet();
    const result = evaluateFormula('=SUM(A1:A3)', spreadsheet);
    expect(result).toBe('6');
  });
});
```

### テスト実行
```bash
# 全テスト実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジ付き
npm run test:coverage
```

## 🔍 コードレビュー

### プルリクエスト要件
- [ ] テストが通過している
- [ ] リンターエラーがない
- [ ] 新機能にはテストが含まれている
- [ ] ドキュメントが更新されている
- [ ] コミットメッセージが明確

### レビュー観点
- コードの可読性
- パフォーマンスへの影響
- セキュリティ考慮事項
- アクセシビリティ対応

## 📚 プロジェクト構造理解

### 主要ディレクトリ
```
client/src/
├── components/     # UIコンポーネント
│   ├── spreadsheet/  # スプレッドシート関連
│   └── ui/          # 汎用UIコンポーネント
├── hooks/         # カスタムReactフック
├── lib/           # ユーティリティ・エンジン
└── pages/         # ページレベルコンポーネント
```

### 重要ファイル
- `lib/formulas.ts`: 数式エンジン
- `lib/spreadsheet.ts`: スプレッドシート操作
- `hooks/useSpreadsheet.ts`: メイン状態管理

## 🐛 バグ報告

### 報告テンプレート
```markdown
## バグの説明
簡潔な説明

## 再現手順
1. 
2. 
3. 

## 期待する動作
何が起こるべきか

## 実際の動作
何が実際に起こったか

## 環境
- OS: 
- ブラウザ: 
- Node.js バージョン: 
```

## 💡 機能提案

### 提案テンプレート
```markdown
## 機能の説明
何を実装したいか

## 動機・背景
なぜこの機能が必要か

## 実装案
どのように実装するか

## 代替案
他の実装方法があるか
```

## 📞 質問・サポート

- GitHub Issues: 技術的な質問やバグ報告
- Discussions: アイデアや一般的な議論

## 🏆 貢献者への謝辞

全ての貢献者に感謝し、プロジェクトの発展に貢献してくださった方々をREADMEに記載します。

## 📄 ライセンス

このプロジェクトに貢献することで、あなたの貢献がMITライセンスの下で公開されることに同意したものとみなされます。