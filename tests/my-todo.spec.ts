import { test, expect } from '@playwright/test';

// 📦 グループ化: "TODO管理機能" という箱を作ります
test.describe('TODO管理機能', () => {

  // 準備: 各テストの前に必ず実行される
  test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/react/dist/', {
      waitUntil: 'domcontentloaded'
    });
  });

  // 📝 テスト1
  test('TODOアイテムを追加して完了にできること', async ({ page }) => {
    await page.getByTestId('text-input').fill('買い物に行く');
    await page.getByTestId('text-input').press('Enter');

    // 検証: リストに表示されているか
    await expect(page.getByText('買い物に行く')).toBeVisible();

    await page.getByTestId('todo-item-toggle').check();

    // 検証: チェックがついたか
    await expect(page.getByTestId('todo-item-toggle')).toBeChecked();
  });

  // 📝 テスト2（新しく追加！）
  test('TODOアイテムを削除できること', async ({ page }) => {
    // 1. まずアイテムを追加
    await page.getByTestId('text-input').fill('掃除する');
    await page.getByTestId('text-input').press('Enter');

    // 2. 削除ボタンを押す (ホバーしないと出ない場合が多いので注意)
    // 今回のアプリでは項目の上にマウスを乗せる(hover)と削除ボタン(destroy)が出ます
    await page.getByText('掃除する').hover();
    await page.getByTestId('todo-item-button').click();

    // 3. 検証: リストから消えていること
    await expect(page.getByText('掃除する')).not.toBeVisible();
  });

});