# Phase 6: テスト設計スキル

## 目次
1. [学習目標](#学習目標)
2. [レッスン 6-1: 何を自動化すべきか判断する](#レッスン-6-1-何を自動化すべきか判断する)
3. [レッスン 6-2: Page Object Model（POM）](#レッスン-6-2-page-object-modelpom)
4. [レッスン 6-3: テストデータの管理](#レッスン-6-3-テストデータの管理)
5. [レッスン 6-4: テストの独立性](#レッスン-6-4-テストの独立性)
6. [よくあるエラーと対処法](#よくあるエラーと対処法)

---

## 学習目標

テストコードを「整理整頓」して、チームで長く使い続けられる設計スキルを身につける。

**たとえるなら**: 部屋の片付け。物が増えてきたら、引き出しにラベルを貼って分類するように、テストコードも「どこに何があるか」をわかりやすく整理する。

**QA視点**: 自動テストの最大の敵は「メンテナンスコスト」。設計が悪いと、テストを維持する手間が増えて結局使われなくなる。ここが実務で最も差がつくポイント。

---

## レッスン 6-1: 何を自動化すべきか判断する

### このレッスンで学ぶこと
「全部自動化」は非効率。何を自動化し、何をマニュアルのままにするかを判断する力をつける。

### 自動化に向いているテスト
- **回帰テスト**: リリースのたびに繰り返す確認（ログインできるか、主要機能が動くか）
- **スモークテスト**: デプロイ後の「煙テスト」（致命的なバグがないかの簡易チェック）
- **データ駆動テスト**: 同じ操作を大量のデータパターンで繰り返すもの

### 自動化に向いていないテスト
- **探索的テスト**: 「何か変なところはないかな？」と自由に触るテスト（人間の直感が必要）
- **UXの評価**: 「使いやすいか？」は人間にしか判断できない
- **一度きりのテスト**: 二度と実行しないテストに自動化の手間をかけるのは割に合わない

### QA視点
マニュアルQAの経験がここで最大の武器になる。「どのテストを何度も繰り返しているか」を知っている人が、自動化の優先順位を正しく決められる。

### 課題 6-1
自分がこれまで学習で書いたテスト（example.spec.ts、my-todo.spec.ts）を見直し、「回帰テスト」「スモークテスト」「探索的テスト」のどれに分類されるか考える。学習ログに理由とともに記録する。

---

## レッスン 6-2: Page Object Model（POM）

### このレッスンで学ぶこと
テストコードを「ページごとのクラス」に分離する設計パターンを学ぶ。

### たとえ話
レシピ本の「材料リスト」と「調理手順」を分けるのと同じ。「材料（ページの要素）」が変わっても「手順（テストの流れ）」を書き直す必要がない。

### Before（整理前）

```typescript
// テストファイルの中に要素の指定と操作が混在
test('TODOを追加できる', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');
  await page.getByPlaceholder('What needs to be done?').fill('牛乳を買う');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await expect(page.getByTestId('todo-item')).toHaveCount(1);
});
```

### After（POMで整理後）

```typescript
// pages/todo-page.ts — ページの「設計図」
import { Page, Locator } from '@playwright/test';

export class TodoPage {
  readonly inputBox: Locator;
  readonly todoItems: Locator;

  constructor(private page: Page) {
    this.inputBox = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.getByTestId('todo-item');
  }

  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc/');
  }

  async addTodo(text: string) {
    await this.inputBox.fill(text);
    await this.inputBox.press('Enter');
  }
}
```

```typescript
// tests/todo.spec.ts — テストの「手順書」
import { TodoPage } from '../pages/todo-page';

test('TODOを追加できる', async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();
  await todoPage.addTodo('牛乳を買う');
  await expect(todoPage.todoItems).toHaveCount(1);
});
```

### なぜPOMが必要か
URLが変わったら `goto()` の1箇所を直すだけ。入力欄のplaceholderが変わっても `inputBox` の定義を1箇所直すだけ。テストが100個あっても修正は1箇所。

### 課題 6-2
1. プロジェクトに `pages/` フォルダを作成する
2. `pages/todo-page.ts` を作成し、TodoMVCの主要操作（goto, addTodo, completeTodo）をまとめる
3. 既存のテストをPOMを使った形にリファクタリングする

---

## レッスン 6-3: テストデータの管理

### このレッスンで学ぶこと
テストで使うデータ（「牛乳を買う」など）を外部から渡す方法を学ぶ。

### たとえ話
料理で言うと、レシピ（テスト手順）は同じでも材料（データ）を変えれば違う料理ができる。テストも同じ手順を色々なデータで試せる。

### テストデータの書き方

```typescript
const todoItems = ['牛乳を買う', '掃除をする', 'レポートを書く'];

for (const item of todoItems) {
  test(`TODO「${item}」を追加できる`, async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.addTodo(item);
    await expect(todoPage.todoItems).toHaveCount(1);
  });
}
```

### QA視点
マニュアルテストの「テストケース一覧」にあるデータパターンを、そのまま自動テストに流し込めるようになる。境界値テストも自動化できる。

### 課題 6-3
3種類のTODOテキスト（通常の文字、長い文字列、絵文字を含む文字列）でTODO追加テストをデータ駆動で書く。

---

## レッスン 6-4: テストの独立性

### このレッスンで学ぶこと
テスト同士が影響し合わないように設計する。

### たとえ話
学校のテストは、問1の答えが間違っていても問2には影響しない。自動テストも同じで、1つが失敗しても他のテストは正しく動くべき。

### 悪い例（テストが順番に依存）

```typescript
// NG: test2はtest1が先に動かないと失敗する
test('test1: TODOを追加', async ({ page }) => { /* ... */ });
test('test2: 追加したTODOを削除', async ({ page }) => { /* ... */ });
```

### 良い例（各テストが独立）

```typescript
// OK: 各テストが自分でデータを準備する
test('TODOを削除できる', async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();
  await todoPage.addTodo('削除するTODO');  // 自分で準備
  await todoPage.deleteTodo('削除するTODO');
  await expect(todoPage.todoItems).toHaveCount(0);
});
```

### 課題 6-4
自分が書いたテストを見直し、テスト間に順番の依存がないか確認する。もし依存があれば、各テストが独立して動くようにリファクタリングする。

---

## よくあるエラーと対処法

### 「Cannot find module '../pages/todo-page'」
**原因**: ファイルのパスが間違っているか、ファイル名のスペルミス
**対処**: フォルダ構造を確認し、相対パス（`../`は一つ上のフォルダの意味）が正しいか確認する

### 「Property 'addTodo' does not exist on type 'TodoPage'」
**原因**: TodoPageクラスにそのメソッドがまだ定義されていない
**対処**: pages/todo-page.ts にメソッドを追加する。TypeScriptは「使う前に定義する」がルール

### POMを導入したらテストが遅くなった気がする
**原因**: 気のせいの可能性が高い。POMは整理術であり、実行速度には影響しない
**安心材料**: POMの目的は速度ではなく保守性。「テストの修正が楽になったか」で効果を判断する
