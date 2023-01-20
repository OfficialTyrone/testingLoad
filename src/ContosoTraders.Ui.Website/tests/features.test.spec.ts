//Tests some features like third-party API , Dark mode, Geolocation, Iframe testing etc
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

//#region Uncomment below lines to run dark mode tests
// test.describe('Dark Mode', () => {
//   test('shows page in dark mode', async ({ page }) => {
//     await page.locator('input.MuiSwitch-input').check()
//     await expect(page.locator('.App')).toHaveAttribute('class', 'App dark')
//   })
// });
//#endregion

//Geolocation Testing
test('Test with geolocation', async ({ page, context, request }) => {
  const ipTest = await request.get(`${process.env.REACT_APP_GEOLOCATIONAPI}`);
  expect(ipTest.status()).toBe(200);
  expect(ipTest.ok()).toBeTruthy();
  const location = JSON.parse(await ipTest.text())
  const latitude = location.latitude
  const longitude = location.longitude
  const point = latitude + ',' + longitude;
  const response = await request.get(`${process.env.REACT_APP_GEOAPIBASEURL}/Locations/${point}?key=${process.env.REACT_APP_BINGMAPSKEY}`);
  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();
  if (latitude != null && longitude != null) {
    await context.setGeolocation({ longitude: parseFloat(longitude), latitude: parseFloat(latitude) });
  }
  await Promise.all([
    page.waitForSelector('#current-location'),
  ]);
});

//Iframe Testing
test('Test with Iframes', async ({ page }) => {
  await page.goto('/');
  await page.mouse.wheel(0, 15000);
  await page.frameLocator('internal:attr=[title="geolocation"i]').getByRole('button', { name: 'Zoom In' }).hover();//hover zoom in button
  await page.frameLocator('internal:attr=[title="geolocation"i]').getByRole('button', { name: 'Zoom In' }).click();
  await page.frameLocator('internal:attr=[title="geolocation"i]').getByRole('button', { name: 'Zoom Out' }).click();
});
