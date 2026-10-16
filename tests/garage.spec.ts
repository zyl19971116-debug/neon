import { expect, test } from '@playwright/test';

const car = (page: import('@playwright/test').Page) => page.getByTestId('garage-car-image');
const src = (page: import('@playwright/test').Page) => car(page).getAttribute('src');

test('garage V2 changes every supported category with real renders', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile', 'Full workflow runs once on desktop');
  await page.addInitScript(() => { Math.random = () => .9; });
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/garage', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => car(page).evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 900)).toBe(true);
  await expect(page.locator('canvas')).toHaveCount(0);
  const categories = ['PAINT', 'WHEELS', 'WHEEL FINISH', 'SPOILER', 'BODY KIT', 'LIVERY', 'HEADLIGHTS', 'WINDOW TINT', 'RIDE HEIGHT', 'PLATE', 'ENVIRONMENT'];
  for (const category of categories) await expect(page.getByRole('button', { name: category, exact: true })).toBeVisible();

  const cases: [string, RegExp, string][] = [
    ['PAINT', /Racing Orange/i, 'ng77-orange-studio'],
    ['WHEELS', /Mesh/i, 'ng77-mesh-studio'],
    ['SPOILER', /Ducktail/i, 'ducktail'],
    ['BODY KIT', /Track/i, 'track'],
    ['LIVERY', /Clean/i, 'ng77-clean-studio'],
    ['HEADLIGHTS', /Vintage Yellow/i, 'vintage-yellow'],
    ['WINDOW TINT', /Dark/i, 'dark'],
    ['RIDE HEIGHT', /Low/i, 'ride-low'],
    ['ENVIRONMENT', /Coastal Highway/i, 'coastal-highway'],
  ];
  for (const [category, option, expected] of cases) {
    await page.getByRole('button', { name: category, exact: true }).click();
    await page.getByRole('button', { name: option }).click();
    await expect.poll(() => src(page)).toContain(expected);
  }

  await page.getByRole('button', { name: 'PAINT', exact: true }).click();
  await expect(page.getByRole('button', { name: /Pearl White/i })).toBeDisabled();
  await page.getByRole('button', { name: 'WHEEL FINISH', exact: true }).click();
  await expect(page.getByRole('button', { name: /Gold/i })).toBeDisabled();

  await page.getByRole('button', { name: 'LIVERY', exact: true }).click();
  await page.getByRole('button', { name: /Number 77/i }).click();
  await page.getByLabel('Race number').fill('218');
  await expect(page.locator('main')).toHaveAttribute('data-config', /"raceNumber":218/);

  await page.getByRole('button', { name: 'PLATE', exact: true }).click();
  await page.getByLabel('License plate').fill('NG-V2');
  await page.getByRole('button', { name: 'UNDO' }).click();
  await expect(page.locator('main')).not.toHaveAttribute('data-config', /NG-V2/);
  await page.getByRole('button', { name: 'REDO' }).click();
  await expect(page.locator('main')).toHaveAttribute('data-config', /NG-V2/);

  await page.getByRole('button', { name: 'SAVE BUILD' }).click();
  await expect(page.getByRole('status')).toContainText('BUILD SAVED');
  await page.getByRole('button', { name: 'RESET' }).click();
  const resetSource = await src(page);
  await page.getByRole('button', { name: 'RANDOM' }).click();
  await expect.poll(() => src(page)).not.toBe(resetSource);
  await page.getByRole('button', { name: 'LOAD BUILD' }).click();
  await expect(page.locator('main')).toHaveAttribute('data-config', /NG-V2/);

  await expect.poll(() => car(page).evaluate((node: HTMLImageElement) => node.complete)).toBe(true);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'CAPTURE' }).click();
  expect((await download).suggestedFilename()).toMatch(/^ng-classic-77-v2-.*\.png$/);
  await page.getByRole('button', { name: 'SHARE' }).click();
  await expect(page.getByRole('status')).toContainText('LINK READY');
  await page.getByRole('button', { name: 'MINT NFT' }).click();
  await expect(page.getByRole('status')).toContainText(/CONNECT A WALLET|CONTRACT IS NOT DEPLOYED/);
});

test('garage V2 mobile uses a bottom customization drawer without overflow', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'Mobile-specific coverage');
  await page.goto('/garage', { waitUntil: 'domcontentloaded' });
  await expect(car(page)).toBeVisible();
  const panel = page.locator('aside').nth(1);
  await expect(panel).toBeVisible();
  const positions = await page.evaluate(() => {
    const stage = document.querySelector('section');
    const panels = Array.from(document.querySelectorAll('aside'));
    const custom = panels[1];
    return { stage: stage?.getBoundingClientRect().top || 0, panel: custom?.getBoundingClientRect().top || 0, overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 };
  });
  expect(positions.panel).toBeGreaterThan(positions.stage);
  expect(positions.overflow).toBe(false);
});
