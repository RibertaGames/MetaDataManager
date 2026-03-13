# MetaDataManager

App Store / Google Play のメタデータを効率的に管理するWebアプリケーションです。fastlaneプロジェクトのメタデータフォルダを直感的に編集できます。

## スクリーンショット

### プロジェクト管理
![プロジェクト管理](https://raw.githubusercontent.com/RibertaGames/MetaDataManager/develop/docs/screenshot-projects.png)

### iOS メタデータ編集（多言語対応）
![iOS メタデータ編集](https://raw.githubusercontent.com/RibertaGames/MetaDataManager/develop/docs/screenshot-ios.png)

### スクリーンショット管理（Android）
![スクリーンショット管理](https://raw.githubusercontent.com/RibertaGames/MetaDataManager/develop/docs/screenshot-screenshots.png)

## 特徴

- 📱 **iOS/Android対応** - App StoreとGoogle Play両方のメタデータを管理
- 🚀 **fastlane統合** - 既存のfastlaneプロジェクトと完全統合
- 🌍 **多言語対応** - 複数言語のメタデータを一元管理
- 💾 **自動保存** - 変更を自動的にfastlaneメタデータフォルダに保存
- 🎨 **直感的なUI** - モダンで使いやすいインターフェース
- 📁 **プロジェクト管理** - 複数のfastlaneプロジェクトを切り替えて管理

## 技術スタック

- **Next.js 16** - Reactフレームワーク
- **TypeScript** - 型安全な開発
- **Tailwind CSS 4** - モダンなUIデザイン
- **PapaParse** - CSV/TSVファイルの読み書き

## インストール

### 必要要件

- Node.js 20以上
- npm または yarn
- fastlaneがセットアップされたプロジェクト

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/RibertaGames/MetaDataManager.git
cd MetaDataManager/metadata-manager

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 使い方

### 1. プロジェクトを追加

1. 「+ 新しいプロジェクト」をクリック
2. プロジェクト名を入力
3. fastlaneフォルダのパスを指定（`metadata/`フォルダが含まれるディレクトリ）
4. 「追加」をクリック

### 2. メタデータを編集

1. プロジェクト一覧から編集したいプロジェクトをクリック
2. iOS または Android タブを選択
3. 言語を選択
4. メタデータを編集
5. 変更は自動的に保存されます

### 3. サポートされるメタデータ

#### iOS (App Store Connect)
- アプリ名
- サブタイトル
- 説明文
- キーワード
- プロモーションテキスト
- リリースノート
- マーケティングURL
- サポートURL
- プライバシーポリシーURL

#### Android (Google Play Console)
- アプリ名
- 簡単な説明
- 詳細な説明
- リリースノート

## フォルダ構造

```
metadata-manager/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # APIルート
│   │   ├── [projectId]/  # プロジェクト詳細ページ
│   │   ├── projects/     # プロジェクト一覧
│   │   └── settings/     # 設定ページ
│   ├── components/       # Reactコンポーネント
│   ├── lib/             # ユーティリティ関数
│   └── types/           # TypeScript型定義
├── public/              # 静的ファイル
└── data/                # プロジェクトデータ（JSON）
```

## 開発

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start
```

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照してください。

## 作者

**TechRiberta** - [株式会社テックリベルタ](https://techriberta.com)

## リンク

- [公式サイト](https://techriberta.com)
- [Twitter](https://x.com/TechRiberta)
- [GitHub](https://github.com/RibertaGames)

## 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## サポート

問題や質問がある場合は、[Issue](https://github.com/RibertaGames/MetaDataManager/issues)を開いてください。
