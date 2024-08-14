import { test, expect } from '@playwright/test';

test.describe('Designer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Creatingly/);
  });

  test('can add element', async ({ page }) => {
    const beforeCount = await page.locator('[draggable]').count();
    await page.getByTestId('Square').click();
    const afterCount = await page.locator('[draggable]').count();

    expect(afterCount).toBe(beforeCount + 1);
  });

  test('can resize', async ({ page }) => {
    await page.getByTestId('Square').click();
    await page.waitForTimeout(100);

    const draggable = await page.locator('[draggable]').first();
    const resizeCorner = draggable.locator('app-resizable-corner').first();

    await draggable.evaluate((node) => {
      node.style.zIndex = '1000';
    });

    const box = await resizeCorner.boundingBox();
    const { width: beforeWidth, height: beforeHeight } =
      await draggable.boundingBox();

    await page.mouse.move(box.x, box.y);
    await page.mouse.down();
    await page.mouse.move(box.x - 50, box.y - 100, {
      steps: 200,
    });
    await page.mouse.up();

    const { width: afterWidth, height: afterHeight } =
      await draggable.boundingBox();

    expect(afterWidth).toBeGreaterThan(beforeWidth + 40);
    expect(afterHeight).toBeGreaterThan(beforeHeight + 90);
  });

  test('can drag', async ({ page }) => {
    await page.getByTestId('Square').click();
    await page.waitForTimeout(100);

    const draggable = await page.locator('[draggable]').first();

    await draggable.evaluate((node) => {
      node.style.zIndex = '1000';
    });

    const box = await draggable.boundingBox();

    const { x: beforeX, y: beforeY, width, height } = box;

    await page.mouse.move(box.x + width / 2, box.y + height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + width / 2 + 50, box.y + height / 2 + 100, {
      steps: 200,
    });
    await page.mouse.up();

    const { x: afterX, y: afterY } = await draggable.boundingBox();

    expect(afterX).toBeGreaterThan(beforeX + 40);
    expect(afterY).toBeGreaterThan(beforeY + 90);
  });

  test('other page can see added element', async ({ context, page: page1 }) => {
    const beforeCount = await page1.locator('[draggable]').count();

    const page2 = await context.newPage();
    await page2.goto('/');
    await page2.getByTestId('Square').click();

    await page1.waitForTimeout(1000);
    const afterCount = await page1.locator('[draggable]').count();

    expect(afterCount).toBe(beforeCount + 1);
  });
});
