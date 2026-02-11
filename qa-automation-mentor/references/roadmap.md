# テスト自動化ロードマップ 全体像

## 目次
1. [完了済みPhase（1-4）](#完了済みphase1-4)
2. [Phase 5: E2Eテストの実践力を深める](#phase-5-e2eテストの実践力を深める)
3. [Phase 6: テスト設計スキル](#phase-6-テスト設計スキル)
4. [Phase 7: APIテストの実践力を深める](#phase-7-apiテストの実践力を深める)
5. [Phase 8: CI/CDの強化と実務フロー](#phase-8-cicdの強化と実務フロー)
6. [Phase 9: 実務を想定した総合演習](#phase-9-実務を想定した総合演習)
7. [Phase 10: 現場で差がつくスキル](#phase-10-現場で差がつくスキル)
8. [進捗管理の考え方](#進捗管理の考え方)

---

## 完了済みPhase（1-4）

学習者はすでに以下を習得済み：

| Phase | 学んだこと | 成果物 |
|-------|-----------|--------|
| 1 | 環境構築（GitHub, Cursor, Node.js, Playwright）、CodeGenでテスト録画 | example.spec.ts |
| 2 | アサーション、beforeEach、リファクタリング、Git操作 | my-todo.spec.ts |
| 3 | Postman導入、GETリクエスト、APIアサーション、デバッグ | MyTest.postman_collection.json |
| 4 | Newman CLI、GitHub Actions、Allure、GitHub Pages公開 | api-test.yml, playwright.yml |

**使用ツール**: Playwright, Postman/Newman, GitHub Actions, Allure
**練習アプリ**: TodoMVC（https://demo.playwright.dev/todomvc/）

---

## Phase 5: E2Eテストの実践力を深める

**ゴール**: CodeGenに頼らず、自分の手でテストを書けるようになる

**キーワード**: ロケーター、ユーザー操作、待機、デバッグ

**前提**: Phase 1-4 完了

**詳細**: → phase05-e2e-deep.md

---

## Phase 6: テスト設計スキル

**ゴール**: テストコードを「整理整頓」して、長く使い続けられる形にする

**キーワード**: Page Object Model、テストデータ管理、自動化判断

**前提**: Phase 5 完了

**詳細**: → phase06-test-design.md

---

## Phase 7: APIテストの実践力を深める

**ゴール**: CRUD全操作と認証付きAPIをテストできるようになる

**キーワード**: POST/PUT/DELETE、トークン認証、PlaywrightでのAPI

**前提**: Phase 3-4 完了

**詳細**: → phase07-api-deep.md

---

## Phase 8: CI/CDの強化と実務フロー

**ゴール**: チーム開発を想定した自動テストパイプラインを構築できる

**キーワード**: PRトリガー、通知、並列実行、環境変数

**前提**: Phase 4 完了

**詳細**: → phase08-cicd-enhance.md

---

## Phase 9: 実務を想定した総合演習

**ゴール**: ポートフォリオとして見せられるテスト自動化プロジェクトを完成させる

**キーワード**: テスト計画書、E2E+API統合、バグ検出

**前提**: Phase 5-8 完了

**詳細**: → phase09-portfolio.md

---

## Phase 10: 現場で差がつくスキル

**ゴール**: チームに「この人がいると助かる」と思われるスキルを身につける

**キーワード**: Visual Regression、アクセシビリティ、Docker、テストピラミッド

**前提**: Phase 9 完了

**詳細**: → phase10-advanced.md

---

## 進捗管理の考え方

### 各Phaseの所要時間の目安

- Phase 5-6: 各2-3セッション（E2Eとテスト設計は交互に学ぶと効果的）
- Phase 7-8: 各2セッション
- Phase 9: 3-4セッション（総合演習は時間をかける）
- Phase 10: 各トピック1セッション（興味のあるものから選択可）

### Phase順序の柔軟性

- Phase 5→6 は順番通りに進めることを推奨（6は5の知識が前提）
- Phase 7 は Phase 5 と並行して進めてもよい（APIとE2Eは独立したスキル）
- Phase 8 は Phase 4 の延長なので、いつでも着手可能
- Phase 9 は Phase 5-8 のいずれか3つ以上を完了してから着手
- Phase 10 の各トピックは独立しており、興味のあるものから選択可能

### 卒業の基準

そのPhaseの課題を**自力で（メンターの助けなしに）完了できた**ら、次のPhaseに進む。
完璧を目指す必要はない。「8割わかって、残り2割は調べれば対応できる」状態が卒業の目安。
