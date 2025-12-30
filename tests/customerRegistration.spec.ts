import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { Util } from '../util'; 
import { RegistrationPage } from '../page-objects/registration.po';

let util: Util;
let registration: RegistrationPage;
let context: BrowserContext;
let page: Page;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext(); 
  page = await context.newPage(); 
  util = new Util(page);
  registration = new RegistrationPage(page);
});

test('create user through registration portal', async () => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
  await registration.clickRegisterOnHomePage();
  await registration.fillRegistrationData();
  await registration.submitRegistration();
  await util.takeScreenshot();
  expect(await util.getPageTitle()).toEqual('ParaBank | Customer Created');
});

test.afterAll(async () => {
  await context.close(); 
});
