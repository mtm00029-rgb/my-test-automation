# Phase 7: APIテストの実践力を深める

## 目次
1. [学習目標](#学習目標)
2. [レッスン 7-1: POST / PUT / DELETE を使いこなす](#レッスン-7-1-post--put--delete-を使いこなす)
3. [レッスン 7-2: 認証（トークン）の扱い](#レッスン-7-2-認証トークンの扱い)
4. [レッスン 7-3: PlaywrightでAPIテストを書く](#レッスン-7-3-playwrightでapiテストを書く)
5. [レッスン 7-4: レスポンスのスキーマ検証](#レッスン-7-4-レスポンスのスキーマ検証)
6. [よくあるエラーと対処法](#よくあるエラーと対処法)

---

## 学習目標

GETだけでなくCRUD全操作（作成・読み取り・更新・削除）をテストでき、認証付きAPIも扱えるようになる。

**たとえるなら**: Phase 3では「メニューを見る（GET）」だけだったレストランで、「注文する（POST）」「注文を変更する（PUT）」「キャンセルする（DELETE）」もできるようになること。

**QA視点**: 実務のAPIテストはGETだけでは不十分。データの作成・更新・削除が正しく動くか、権限のない操作がちゃんと拒否されるかまで確認して初めて品質を保証できる。

---

## レッスン 7-1: POST / PUT / DELETE を使いこなす

### このレッスンで学ぶこと
データの「作成・更新・削除」をAPIで行い、それぞれの結果を検証する。

### HTTPメソッドの整理

| メソッド | たとえ | やること |
|---------|--------|---------|
| GET | メニューを見る | データを取得する |
| POST | 新しく注文する | データを新しく作る |
| PUT | 注文を変更する | 既存のデータを更新する |
| DELETE | 注文をキャンセルする | データを削除する |

### Postmanでの操作手順

**POST（新規作成）の例:**
1. メソッドを「POST」に変更
2. URLに `https://jsonplaceholder.typicode.com/posts` を入力
3. 「Body」タブ → 「raw」 → 「JSON」を選択
4. 以下を入力：
```json
{
  "title": "テスト投稿",
  "body": "これはテストです",
  "userId": 1
}
```
5. 「Send」を押す → 201 Created が返ればOK

### アサーションの追加

```javascript
// ステータスコードが201（作成成功）であること
pm.test("ステータスコード 201", function () {
    pm.response.to.have.status(201);
});

// 送ったデータがそのまま返ってきていること
pm.test("タイトルが正しい", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.title).to.eql("テスト投稿");
});
```

### 課題 7-1
JSONPlaceholder APIに対して以下の4つのリクエストをPostmanで作成し、各リクエストにアサーションを2つ以上追加する：
1. GET `/posts/1` — 記事を取得
2. POST `/posts` — 新しい記事を作成
3. PUT `/posts/1` — 記事を更新
4. DELETE `/posts/1` — 記事を削除

---

## レッスン 7-2: 認証（トークン）の扱い

### このレッスンで学ぶこと
「ログインしないと使えないAPI」のテスト方法を学ぶ。

### たとえ話
会員制レストランに入るには「会員カード（トークン）」が必要。最初に受付で名前とパスワードを言って（ログイン）、カードをもらい（トークン取得）、そのカードを見せて入店する（認証付きリクエスト）。

### トークン認証の流れ

```
1. ログインリクエストを送る → トークンをもらう
2. もらったトークンをヘッダーに付けてリクエストを送る
3. トークンがないリクエストは 401（お断り）になることも確認
```

### Postmanでの設定方法

**環境変数にトークンを保存する方法:**
```javascript
// ログインリクエストのScriptsタブに書く
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);
```

**以降のリクエストでトークンを使う:**
- 「Authorization」タブ → Type: Bearer Token → Token: `{{token}}`

### QA視点
認証テストで最も重要なのは「正常にログインできる」だけでなく「不正なトークンで拒否される」こと。セキュリティの基本。

### 課題 7-2
練習用認証API（https://reqres.in）を使って：
1. `POST /api/login` でログインし、トークンを取得する
2. 正しいメールアドレスとパスワードでトークンが返ることを確認する
3. パスワードなしでリクエストして、エラー（400）が返ることを確認する

---

## レッスン 7-3: PlaywrightでAPIテストを書く

### このレッスンで学ぶこと
PostmanではなくPlaywrightのコードでAPIテストを書く方法を学ぶ。これにより、E2EテストとAPIテストを1つのツールで管理できる。

### たとえ話
今まで「厨房の検査（API）」と「客席の検査（E2E）」で別の検査員を使っていたが、一人の検査員が両方できるようになるイメージ。

### PlaywrightでのAPIリクエスト

```typescript
import { test, expect } from '@playwright/test';

test('APIで記事を取得できる', async ({ request }) => {
  const response = await request.get(
    'https://jsonplaceholder.typicode.com/posts/1'
  );
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.id).toBe(1);
  expect(body.title).toBeTruthy();
});

test('APIで記事を作成できる', async ({ request }) => {
  const response = await request.post(
    'https://jsonplaceholder.typicode.com/posts',
    {
      data: {
        title: 'テスト投稿',
        body: 'これはテストです',
        userId: 1,
      },
    }
  );
  expect(response.status()).toBe(201);
});
```

### PostmanとPlaywrightの比較

| 観点 | Postman | Playwright |
|------|---------|------------|
| 使いやすさ | GUIで直感的 | コードを書く必要あり |
| チームでの共有 | Postmanアカウントが必要 | Gitで管理できる |
| E2Eとの統合 | 別ツール | 同じテストファイルで書ける |
| CI/CD | Newman経由 | そのまま動く |

### 課題 7-3
Phase 7-1でPostmanに作ったCRUDテストを、Playwright の `request` を使ってTypeScriptで書き直す。ファイル名は `tests/api/posts.spec.ts` とする。

---

## レッスン 7-4: レスポンスのスキーマ検証

### このレッスンで学ぶこと
APIの返すデータが「正しい形」をしているかチェックする方法を学ぶ。

### たとえ話
通販で注文した商品が届いた時、「中身が正しいか」だけでなく「箱の形（個数、種類）が注文通りか」を確認する。値だけでなく構造もチェックする。

### 構造の検証例

```typescript
test('レスポンスの構造が正しい', async ({ request }) => {
  const response = await request.get(
    'https://jsonplaceholder.typicode.com/posts/1'
  );
  const body = await response.json();

  // 必要なフィールドが存在すること
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('title');
  expect(body).toHaveProperty('body');
  expect(body).toHaveProperty('userId');

  // 型が正しいこと
  expect(typeof body.id).toBe('number');
  expect(typeof body.title).toBe('string');
});
```

### QA視点
値が正しくても型が違うと、画面が壊れることがある（例：数字のはずが文字列で返ってきて計算できない）。スキーマ検証は「データの形」を守る防波堤。

### 課題 7-4
`GET /posts/1` のレスポンスに対して、全フィールド（id, title, body, userId）の存在確認と型チェックを行うテストを書く。

---

## よくあるエラーと対処法

### 「404 Not Found」が返ってくる
**原因**: URLが間違っている（スペルミス、スラッシュの有無）
**対処**: APIのドキュメントでURLを再確認。`/posts` と `/post`（sの有無）で変わる

### 「415 Unsupported Media Type」
**原因**: リクエストの形式（Content-Type）が正しく設定されていない
**対処**: PostmanならBody→raw→JSON、Playwrightならdataオプションにオブジェクトを渡す（自動でJSONになる）

### 「401 Unauthorized」
**原因**: トークンが付いていない、または期限切れ
**対処**: まずログインリクエストを送り直してトークンを再取得する。テストでは毎回ログインからスタートすると安定する
