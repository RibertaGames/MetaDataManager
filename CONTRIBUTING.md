# Contributing to MetaDataManager

MetaDataManagerへの貢献ありがとうございます！

## 貢献方法

### バグ報告

バグを発見した場合は、以下の情報を含めてIssueを作成してください：

- バグの詳細な説明
- 再現手順
- 期待される動作
- 実際の動作
- 環境情報（OS、Node.jsバージョンなど）
- スクリーンショット（可能であれば）

### 機能提案

新機能の提案は大歓迎です！Issueを作成して以下を含めてください：

- 機能の詳細な説明
- ユースケース
- なぜこの機能が必要なのか

### プルリクエスト

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

#### プルリクエストのガイドライン

- コードは既存のスタイルに従ってください
- 変更内容を明確に説明してください
- 必要に応じてテストを追加してください
- コミットメッセージは明確で簡潔に

## 開発環境のセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/RibertaGames/MetaDataManager.git
cd MetaDataManager/metadata-manager

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

## コーディング規約

- TypeScriptを使用
- ESLintのルールに従う
- わかりやすい変数名・関数名を使用
- 複雑なロジックにはコメントを追加

## 質問がある場合

質問がある場合は、遠慮なくIssueを作成してください。

## ライセンス

貢献したコードはMITライセンスの下でライセンスされます。
