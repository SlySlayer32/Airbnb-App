const { device, expect, element, by, waitFor } = require('detox');

describe('Airbnb Property Manager E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  afterAll(async () => {
    await device.terminateApp();
  });

  describe('Authentication Flow', () => {
    it('should display login screen on app launch', async () => {
      await expect(
        element(by.text('Welcome to Airbnb Property Manager'))
      ).toBeVisible();
    });

    it('should allow user to login with valid credentials', async () => {
      // Add login test implementation
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();

      await waitFor(element(by.text('Dashboard')))
        .toBeVisible()
        .withTimeout(10000);
    });
  });

  describe('Property Management', () => {
    it('should display properties list', async () => {
      await expect(element(by.text('Properties'))).toBeVisible();
    });

    it('should allow adding new property', async () => {
      await element(by.id('add-property-button')).tap();
      await expect(element(by.text('Add New Property'))).toBeVisible();
    });
  });

  describe('Navigation', () => {
    it('should navigate between main tabs', async () => {
      await element(by.text('Properties')).tap();
      await expect(element(by.text('Properties'))).toBeVisible();

      await element(by.text('Maintenance')).tap();
      await expect(element(by.text('Maintenance'))).toBeVisible();

      await element(by.text('Schedule')).tap();
      await expect(element(by.text('Schedule'))).toBeVisible();
    });
  });
});
