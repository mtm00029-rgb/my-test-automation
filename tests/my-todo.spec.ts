import { test, expect } from '@playwright/test';
// 【新登場！】テストが始まる前に、必ずこのページを開く設定
test.beforeEach(async ({ page }) => {
  await page.goto('https://todomvc.com/examples/react/dist/');
});
test('TODOアイテムを追加して完了にできること', async ({ page }) => {
  await page.getByTestId('text-input').fill('買い物に行く');
  await page.getByTestId('text-input').press('Enter');
  // --- ここにアサーション（検品）を追加！ ---
  // 「買い物に行く」という文字が画面に表示されている（Visible）ことを期待する
  await expect(page.getByText('買い物に行く')).toBeVisible();
  await page.getByTestId('todo-item-toggle').check();
  // 「チェックボックスがチェックされている状態」であることを期待する
  await expect(page.getByTestId('todo-item-toggle')).toBeChecked();
  await page.getByRole('link', { name: 'Completed' }).click();
});