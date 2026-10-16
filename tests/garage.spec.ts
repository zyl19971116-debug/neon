import { expect, test } from '@playwright/test';

const readyCanvas = async (page: import('@playwright/test').Page) => {
  await expect(page.locator('[data-render-state="ready"]')).toBeVisible({ timeout: 15_000 });
  const canvas = page.locator('canvas#garage-canvas');
  await expect(canvas).toBeVisible();
  await expect.poll(() => canvas.evaluate((node: HTMLCanvasElement) => node.toDataURL('image/png').length)).toBeGreaterThan(5_000);
  return canvas;
};

test('garage 3D configurator updates, restores, captures, and keeps history', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile', 'Full interaction suite runs once in desktop Chromium');
  await page.goto('/garage', { waitUntil: 'domcontentloaded' });
  const canvas = await readyCanvas(page);
  const initialImage = await canvas.evaluate((node: HTMLCanvasElement) => node.toDataURL());

  await page.getByRole('button', { name: 'Petrol Teal' }).click();
  await expect(page.locator('main')).toHaveAttribute('data-config', /#0ea5a4/i);
  await expect.poll(() => canvas.evaluate((node: HTMLCanvasElement) => node.toDataURL())).not.toBe(initialImage);

  await page.getByRole('button', { name: 'WHEELS' }).click();
  await page.getByRole('button', { name: 'mesh' }).click();
  await expect(page.locator('main')).toHaveAttribute('data-config', /"wheelId":"mesh"/);

  await page.getByRole('button', { name: 'SCENE' }).click();
  await page.getByRole('button', { name: /NIGHT/ }).click();
  await expect(page.locator('main')).toHaveAttribute('data-config', /"environment":"night"/);

  await page.getByRole('button', { name: 'DETAILS' }).click();
  await page.getByLabel('License plate').fill('NG2026');
  await expect(page.locator('main')).toHaveAttribute('data-config', /NG2026/);

  await page.getByRole('button', { name: 'UNDO' }).click();
  await expect(page.locator('main')).not.toHaveAttribute('data-config', /NG2026/);
  await page.getByRole('button', { name: 'REDO' }).click();
  await expect(page.locator('main')).toHaveAttribute('data-config', /NG2026/);

  await page.getByRole('button', { name: 'SAVE BUILD' }).click();
  await expect(page.getByRole('status')).toContainText('BUILD SAVED');
  await page.reload();
  await readyCanvas(page);
  await expect(page.locator('main')).toHaveAttribute('data-config', /NG2026/);

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'CAPTURE' }).click();
  expect((await download).suggestedFilename()).toMatch(/^neon-garage-.*\.png$/);

  await page.getByRole('button', { name: 'RESET' }).click();
  await expect(page.locator('main')).toHaveAttribute('data-config', /NEON77/);
  await expect(page.getByRole('button', { name: 'MINT NFT' })).toHaveAttribute('title', /connected wallet and deployed contract/i);
});

test('3D failure exits loading and retry restores the live canvas', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile', 'Recovery path runs once in desktop Chromium');
  await page.goto('/garage?simulate3dError=1', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('3D SCENE COULD NOT START')).toBeVisible({ timeout: 5_000 });
  await page.getByRole('button', { name: /RETRY 3D/ }).click();
  await readyCanvas(page);
});

test('garage mobile layout renders the real WebGL vehicle and controls', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'Mobile-specific coverage');
  await page.goto('/garage', { waitUntil: 'domcontentloaded' });
  await readyCanvas(page);
  await expect(page.getByText('MY GARAGE')).toBeVisible();
  await expect(page.getByRole('button', { name: 'SAVE BUILD' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow).toBe(false);
});
