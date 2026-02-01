import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://todomvc.com/examples/react/dist/');
  await page.getByTestId('text-input').click();
  await page.getByTestId('text-input').fill('買い物に行く');
  await page.getByTestId('text-input').press('Enter');
  await page.getByTestId('text-input').fill('買い物に行く');
  await page.getByTestId('todo-item-toggle').check();
  await page.getByRole('link', { name: 'Completed' }).click();
  await page.getByRole('link', { name: 'Completed' }).click();
});