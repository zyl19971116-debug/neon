import { expect, test } from '@playwright/test';

const car = (page: import('@playwright/test').Page) => page.getByTestId('garage-car-image');
const src = (page: import('@playwright/test').Page) => car(page).getAttribute('src');

test('garage 2D studio switches real assets, saves, restores and captures', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile', 'Full workflow runs once on desktop');
  await page.goto('/garage', { waitUntil: 'domcontentloaded' });
  await expect(car(page)).toBeVisible();
  await expect.poll(() => car(page).evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 1000)).toBe(true);
  await expect(page.locator('canvas')).toHaveCount(0);
  const initial = await src(page);

  await page.getByRole('button', { name: /RACING ORANGE/ }).click();
  await expect.poll(() => src(page)).not.toBe(initial);
  await expect(page.locator('main')).toHaveAttribute('data-config', /racing-orange/);

  await page.getByRole('button', { name: 'WHEELS' }).click();
  await page.getByRole('button', { name: /mesh/i }).click();
  await expect(page.locator('main')).toHaveAttribute('data-config', /"wheelId":"mesh"/);
  await expect.poll(() => src(page)).toContain('ng77-mesh-studio');

  await page.getByRole('button', { name: 'LIVERY' }).click();
  await page.getByRole('button', { name: /CLEAN BODY/ }).click();
  await expect.poll(() => src(page)).toContain('ng77-clean-studio');

  await page.getByRole('button', { name: 'SCENE' }).click();
  await page.getByRole('button', { name: /NIGHT STREET/ }).click();
  await expect.poll(() => src(page)).toContain('night-street');

  await page.getByRole('button', { name: 'FRONT' }).click();
  await expect.poll(() => src(page)).toContain('front-sunset');

  await page.getByRole('button', { name: 'DETAILS' }).click();
  await page.getByLabel('License plate').fill('NG2026');
  await page.getByRole('button', { name: 'UNDO' }).click();
  await expect(page.locator('main')).not.toHaveAttribute('data-config', /NG2026/);
  await page.getByRole('button', { name: 'REDO' }).click();
  await expect(page.locator('main')).toHaveAttribute('data-config', /NG2026/);

  await page.getByRole('button', { name: 'SAVE DRAFT' }).click();
  await expect(page.getByRole('status')).toContainText('DRAFT SAVED');
  await page.getByRole('button', { name: 'RESET' }).click();
  await page.getByRole('button', { name: 'RESTORE' }).click();
  await expect(page.locator('main')).toHaveAttribute('data-config', /NG2026/);
  await expect.poll(() => car(page).evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 1000)).toBe(true);

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'CAPTURE' }).click();
  expect((await download).suggestedFilename()).toMatch(/^ng-classic-77-.*\.png$/);
  await page.getByRole('button', { name: 'MINT NFT' }).click();
  await expect(page.getByRole('status')).toContainText(/CONNECT A WALLET|CONTRACT IS NOT DEPLOYED/);
});

test('garage mobile image and controls stay aligned without overflow', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'Mobile-specific coverage');
  await page.goto('/garage', { waitUntil: 'domcontentloaded' });
  await expect(car(page)).toBeVisible();
  await expect(page.getByText('MY GARAGE')).toBeVisible();
  await expect(page.getByRole('button', { name: 'SAVE DRAFT' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});
