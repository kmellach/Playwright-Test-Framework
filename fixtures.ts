import { test as base, expect } from '@playwright/test';
import { full } from './env';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto(full('/parabank/index.htm'), { waitUntil: 'domcontentloaded' });
    await use(page);
  },
});

export { expect };
