import { test, expect } from '@playwright/test';

let _productid = 1;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test.describe('Header', () => {
  test('should be able to search by text', async ({ page }) => {
    await page.getByPlaceholder('Search by product name or search by image').fill('laptops');
    await page.getByPlaceholder('Search by product name or search by image').press('Enter');
    await expect(page).toHaveURL('/suggested-products-list');
  });
  test('should be able to select category', async ({ page }) => {
    await page.getByRole('button', { name: 'All Categories' }).click();
    await page.getByRole('menuitem', { name: 'Laptops' }).click();
    await expect(page).toHaveURL('/list/laptops');
  });
  test('should be able to hover over header menus', async ({ page }) => {
    await page.getByRole('navigation').getByRole('link', { name: 'All Products' }).hover();
    await page.getByRole('navigation').getByRole('link', { name: 'Laptops' }).hover();
    await page.getByRole('navigation').getByRole('link', { name: 'Controllers' }).hover();
    await page.getByRole('navigation').getByRole('link', { name: 'Mobiles' }).hover();
    await page.getByRole('navigation').getByRole('link', { name: 'Monitors' }).hover();
  });
  test('should be able to select header menu', async ({ page }) => {
    await page.getByRole('navigation').getByRole('link', { name: 'All Products' }).click();
    await expect(page).toHaveURL('/list/all-products');
  });

});

test.describe('Home page', () => {
  // Corousel
  test('should be able to select buy now in corosel', async ({ page }) => {
    await page.getByRole('button', { name: 'Buy Now' }).first().click();
    await expect(page).toHaveURL('/product/detail/' + _productid);
  });
  test('should be able to select more details in corosel', async ({ page }) => {
    await page.getByRole('button', { name: 'More Details' }).first().click();
    await expect(page).toHaveURL('/list/controllers');
  });
  // Banner
  test('should be able to click start shopping', async ({ page }) => {
    await page.locator('section').getByRole('button', { name: 'Start Shopping' }).click();
    await expect(page).toHaveURL('/list/controllers');
  });
  test('should be able to explore other products', async ({ page }) => {
    await page.getByRole('button', { name: 'Explore Other Products' }).click();
    await expect(page).toHaveURL('/list/laptops');
  });
  test('should be able to start shopping in footer', async ({ page }) => {
    await page.getByRole('button', { name: 'Start Shopping' }).nth(1).click();
    await expect(page).toHaveURL('/list/controllers');
  });
});

test.describe('Product Listing', () => {
  test('should be able to select product to view details', async ({ page }) => {
    await page.goto('/list/all-products');
    await page.locator('.MuiGrid-root > .MuiPaper-root').first().click();
    await expect(page).toHaveURL('/product/detail/' + _productid);
  });
  test('should be able to filter product by brands', async ({ page }) => {
    await page.goto('/list/all-products');
    await page.locator('[id="\\32 "]').check();
  });
});

test.describe('Footer', () => {
  test('should be able to select footer menu', async ({ page }) => {
    await page.getByRole('listitem').filter({ hasText: 'Monitors' }).getByRole('link', { name: 'Monitors' }).click();
    await expect(page).toHaveURL('/list/monitors');
  });
});