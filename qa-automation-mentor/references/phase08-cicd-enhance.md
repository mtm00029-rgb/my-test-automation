# Phase 8: CI/CDの強化と実務フロー

## 目次
1. [学習目標](#学習目標)
2. [レッスン 8-1: PRトリガーでテストを自動実行](#レッスン-8-1-prトリガーでテストを自動実行)
3. [レッスン 8-2: テスト失敗時の通知](#レッスン-8-2-テスト失敗時の通知)
4. [レッスン 8-3: 並列実行で高速化](#レッスン-8-3-並列実行で高速化)
5. [レッスン 8-4: 環境変数の管理](#レッスン-8-4-環境変数の管理)
6. [よくあるエラーと対処法](#よくあるエラーと対処法)

---

## 学習目標

チーム開発を想定した自動テストの運用基盤を構築できるようになる。

**たとえるなら**: Phase 4で作った「自動採点機」を、教室全体で使える「学校の試験システム」にグレードアップするイメージ。先生が答案を出したら自動で採点され、結果が通知される。

**QA視点**: 実務では「テストが書ける」だけでなく「テストが自動で回り続ける仕組みを運用できる」ことが求められる。CI/CDの設計はQAエンジニアの大きな付加価値。

---

## レッスン 8-1: PRトリガーでテストを自動実行

### このレッスンで学ぶこと
コードの変更提案（プルリクエスト＝PR）を出した時に、自動でテストが走る仕組みを作る。

### たとえ話
PRは「提案書」のようなもの。提案書を出したら自動で内容チェックが走り、問題がなければ承認される。テストが通らない提案書はマージ（統合）できないようにする。

### YAMLの設定

```yaml
# .github/workflows/playwright.yml の冒頭を変更
name: Playwright Tests
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]   # ← この行を追加！
```

### 設定の意味
- `push: branches: [main]` — mainブランチに直接プッシュした時にテスト実行
- `pull_request: branches: [main]` — mainブランチへのPRを作った時にもテスト実行

### QA視点
PRでテストが通らないとマージできない仕組みは「品質ゲート」と呼ばれる。バグがmainブランチに入るのを水際で防ぐ、QAの最前線。

### 課題 8-1
1. 既存の playwright.yml に `pull_request` トリガーを追加する
2. 新しいブランチを作り、テストを1つ追加してPRを作成する
3. PRの画面でテストが自動実行されることを確認する

---

## レッスン 8-2: テスト失敗時の通知

### このレッスンで学ぶこと
テストが失敗した時に自動でお知らせが届く仕組みを作る。

### たとえ話
家のセキュリティアラーム。異常があったら自動で通知が飛ぶ。毎回自分でカメラを確認しなくても安心できる。

### GitHub Actions での通知方法（メール）

GitHubはデフォルトでワークフロー失敗時にメール通知を送る。設定は：
- GitHub → Settings → Notifications → Actions で確認

### Slack通知の追加（発展）

```yaml
# ワークフローの最後に追加
- name: Slack通知
  if: failure()
  uses: slackapi/slack-github-action@v2.0.0
  with:
    webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
    webhook-type: incoming-webhook
    payload: |
      {
        "text": "テストが失敗しました！確認してください。"
      }
```

### 課題 8-2
1. GitHub の通知設定でActions の失敗通知がONになっていることを確認する
2. わざと失敗するテストをPushして、通知が届くことを確認する
3.（発展）Slackのワークスペースがあれば、Webhook通知を設定してみる

---

## レッスン 8-3: 並列実行で高速化

### このレッスンで学ぶこと
テストを複数同時に走らせて、全体の実行時間を短くする。

### たとえ話
100枚の答案を1人で採点すると2時間かかるが、4人で分担すれば30分。テストも同じで、複数のワーカー（採点者）に分担させる。

### Playwrightの並列実行設定

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 2 : undefined,
  // CI環境では2つのワーカーで並列実行
  // ローカルではCPUコア数に応じて自動決定
});
```

### 並列実行の注意点
テストが独立していないと並列実行で問題が起きる。Phase 6のテスト独立性が前提条件。

### 課題 8-3
1. playwright.config.ts の workers を 1 に設定してテストを実行し、実行時間を記録する
2. workers を 2 に変更して同じテストを実行し、実行時間の差を比較する
3. 結果を学習ログに記録する

---

## レッスン 8-4: 環境変数の管理

### このレッスンで学ぶこと
開発環境と本番環境でURLやAPIキーを切り替える仕組みを作る。

### たとえ話
テスト用のお店（開発環境）と本物のお店（本番環境）で、住所（URL）が違う。テストのコードを書き換えずに行き先を変える仕組み。

### 環境変数の使い方

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'https://demo.playwright.dev/todomvc/',
  },
});
```

```typescript
// テストコードでは相対パスが使える
test('TODOページが開ける', async ({ page }) => {
  await page.goto('/');  // baseURLが自動で前に付く
});
```

### GitHub Actionsでの環境変数設定

```yaml
env:
  BASE_URL: https://staging.example.com

# または、シークレットとして保存（APIキーなど秘密の値）
# GitHub → Settings → Secrets → Actions で設定
```

### QA視点
パスワードやAPIキーを直接コードに書くのは絶対NG（セキュリティリスク）。環境変数やシークレットで安全に管理する。

### 課題 8-4
1. playwright.config.ts に `baseURL` を環境変数から読み取る設定を追加する
2. テストコード内のURLを相対パス（`/`）に書き換える
3. `BASE_URL=... npx playwright test` のようにコマンドで環境変数を渡して実行する

---

## よくあるエラーと対処法

### PRのテストが「queued」のまま動かない
**原因**: GitHub Actionsの無料枠の実行待ち、またはワークフローファイルの構文エラー
**対処**: Actionsタブでログを確認。YAMLのインデント（字下げ）が崩れていないか要チェック

### 「Resource not accessible by integration」
**原因**: GitHub Actionsのワークフローに必要な権限が不足している
**対処**: ワークフローファイルに `permissions` セクションを追加する（Phase 4で経験済み）

### 環境変数が undefined になる
**原因**: 変数名のスペルミス、またはシークレットの設定漏れ
**対処**: `echo $変数名` でデバッグ。シークレットはGitHub Settings → Secrets で設定されているか確認
