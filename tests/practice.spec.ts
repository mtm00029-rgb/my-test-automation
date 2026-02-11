import { test, expect } from '@playwright/test';

test('Phase 5 練習: ロケーターを手書きする', async ({ page }) => {
    // TodoMVCアプリを開く
    await page.goto('https://demo.playwright.dev/todomvc/', {
        waitUntil: 'domcontentloaded'
    });

    await page.getByPlaceholder('What needs to be done?').fill('テスト勉強');
    await page.getByPlaceholder('What needs to be done?').press('Enter');
    // 検証: リストに表示されているか
    await expect(page.getByText('テスト勉強')).toBeVisible();

    // 修正: 特定のTODOアイテム（"テスト勉強"）を特定する
    const todoItem = page.getByRole('listitem').filter({ hasText: 'テスト勉強' });

    // そのアイテムの中にあるチェックボックスをクリック
    await todoItem.getByRole('checkbox').check();

    // 検証: チェックがついたか
    await expect(todoItem.getByRole('checkbox')).toBeChecked();

});