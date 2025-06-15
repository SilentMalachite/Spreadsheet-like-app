# デプロイメントガイド

プロ表計算ソフトのデプロイメント方法について説明します。開発環境から本番環境まで、各段階でのデプロイメント手順を詳しく解説します。

## 目次

1. [開発環境](#開発環境)
2. [本番ビルド](#本番ビルド)
3. [Electronアプリのビルド](#electronアプリのビルド)
4. [Webアプリケーションのデプロイ](#webアプリケーションのデプロイ)
5. [GitHub Pages](#github-pages)
6. [トラブルシューティング](#トラブルシューティング)

## 開発環境

### 前提条件
- Node.js 20以降
- npm または yarn
- Git

### 開発サーバーの起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 別ターミナルでElectronアプリの起動
npm run electron
```

開発サーバーは `http://localhost:5000` で起動します。

### 開発環境の設定

#### 環境変数
開発環境用の環境変数を `.env.development` に設定：

```bash
# .env.development
NODE_ENV=development
VITE_APP_NAME=プロ表計算ソフト
VITE_APP_VERSION=1.0.0
```

#### ホットリロード
Viteの開発サーバーはファイル変更を自動検知し、ブラウザを自動更新します。

## 本番ビルド

### Webアプリケーションのビルド

```bash
# 本番用ビルド
npm run build

# ビルド結果の確認
npm run preview
```

ビルド成果物は `dist/` フォルダに生成されます。

### ビルド構成

```
dist/
├── public/          # 静的ファイル
│   ├── index.html
│   ├── assets/      # CSS、JSファイル
│   └── ...
└── index.js         # サーバーファイル
```

### 環境変数の設定

本番環境用の環境変数：

```bash
# .env.production
NODE_ENV=production
VITE_APP_NAME=プロ表計算ソフト
VITE_APP_VERSION=1.0.0
```

## Electronアプリのビルド

### 開発用Electronアプリ

```bash
# Electronアプリの起動（開発モード）
npm run electron

# または
npm run electron:dev
```

### 本番用Electronアプリのビルド

```bash
# 本番用ビルド
npm run build

# Electronアプリのパッケージング
npm run electron:build
```

### プラットフォーム別ビルド

#### Windows
```bash
npm run electron:build:win
```

#### macOS
```bash
npm run electron:build:mac
```

#### Linux
```bash
npm run electron:build:linux
```

### ビルド設定

`electron-builder.json` で設定を調整：

```json
{
  "appId": "com.yourcompany.spreadsheet",
  "productName": "プロ表計算ソフト",
  "directories": {
    "output": "dist-electron"
  },
  "files": [
    "dist/**/*",
    "electron/**/*",
    "package.json"
  ],
  "mac": {
    "category": "public.app-category.productivity"
  },
  "win": {
    "target": "nsis"
  },
  "linux": {
    "target": "AppImage"
  }
}
```

## Webアプリケーションのデプロイ

### 静的ホスティング

#### Netlify
1. `npm run build` でビルド
2. `dist/public` フォルダをアップロード
3. 自動デプロイ設定

#### Vercel
1. GitHubリポジトリを連携
2. ビルド設定：
   - Build Command: `npm run build`
   - Output Directory: `dist/public`

### サーバーデプロイ

#### PM2を使用したデプロイ

```bash
# PM2のインストール
npm install -g pm2

# アプリケーションの起動
pm2 start dist/index.js --name "spreadsheet-app"

# 自動起動設定
pm2 startup
pm2 save
```

#### Docker

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
COPY electron/ ./electron/

EXPOSE 5000

CMD ["node", "dist/index.js"]
```

```bash
# Dockerイメージのビルド
docker build -t spreadsheet-app .

# コンテナの起動
docker run -p 5000:5000 spreadsheet-app
```

## GitHub Pages

### 設定手順

1. GitHubリポジトリの Settings → Pages に移動
2. Source を "GitHub Actions" に設定
3. 以下のワークフローファイルを作成

#### GitHub Actionsワークフロー

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist/public
```

### ベースパスの設定

GitHub Pagesで動作させるため、`vite.config.ts` を更新：

```typescript
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/spreadsheet-app/' : '/',
  // 他の設定...
});
```

## 環境別設定

### 開発環境

```bash
# .env.development
NODE_ENV=development
VITE_API_URL=http://localhost:5000
VITE_DEBUG=true
```

### ステージング環境

```bash
# .env.staging
NODE_ENV=staging
VITE_API_URL=https://staging.example.com
VITE_DEBUG=true
```

### 本番環境

```bash
# .env.production
NODE_ENV=production
VITE_API_URL=https://api.example.com
VITE_DEBUG=false
```

## パフォーマンス最適化

### ビルド最適化

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### 静的アセット最適化

- 画像の圧縮
- CSS・JSの最小化
- Gzip圧縮の有効化

## セキュリティ設定

### Content Security Policy

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  font-src 'self';
">
```

### Electronセキュリティ

```javascript
// electron/main.js
const mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    preload: path.join(__dirname, 'preload.js')
  }
});
```

## 監視・ログ

### エラー監視

```typescript
// エラー監視の設定
window.addEventListener('error', (event) => {
  console.error('Application Error:', event.error);
  // エラー報告サービスに送信
});
```

### パフォーマンス監視

```typescript
// パフォーマンス測定
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`${entry.name}: ${entry.duration}ms`);
  }
});

observer.observe({ entryTypes: ['measure', 'navigation'] });
```

## トラブルシューティング

### よくある問題

#### ビルドエラー

```bash
# キャッシュのクリア
rm -rf node_modules dist
npm install
npm run build
```

#### Electronアプリが起動しない

```bash
# Electronの再インストール
npm uninstall electron
npm install electron --save-dev
```

#### 環境変数が読み込まれない

- ファイル名が正しいか確認（`.env.production`）
- `VITE_` プレフィックスが付いているか確認
- ビルド後に再起動

### デバッグ方法

#### 開発環境でのデバッグ

```bash
# 詳細ログの有効化
DEBUG=* npm run dev
```

#### 本番環境でのデバッグ

```bash
# ログレベルの設定
NODE_ENV=production LOG_LEVEL=debug npm start
```

### パフォーマンス問題

- Bundle Analyzerでファイルサイズを確認
- Chrome DevToolsでパフォーマンス測定
- メモリリークの検出

## チェックリスト

### デプロイ前チェック

- [ ] 全てのテストが通過
- [ ] ビルドエラーがない
- [ ] 環境変数が設定済み
- [ ] セキュリティ設定が適切
- [ ] パフォーマンスが基準を満たす

### デプロイ後チェック

- [ ] アプリケーションが正常に起動
- [ ] 主要機能が動作
- [ ] エラーログの確認
- [ ] パフォーマンス監視の設定

## サポート

デプロイメントに関する質問や問題は、GitHubのIssuesでお知らせください。