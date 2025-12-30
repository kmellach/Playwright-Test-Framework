import { test, expect, Locator, BrowserContext, Page } from '@playwright/test';
import { Registration } from '../api-data/registerUser';
import { LoginPage } from '../page-objects/login.po';
import { Util } from '../util'; 

let util: Util;
let login : LoginPage;
let registration: Registration;
let context: BrowserContext;
let page: Page;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  util = new Util(page); 
  login = new LoginPage(page);
  registration = new Registration(page);

});


test('has title', async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
  await expect(page).toHaveTitle(/ParaBank/);
});

test('login', async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
  await login.fillLoginData();
  await login.submitLogin();
  await util.takeScreenshot();
  expect(await util.getPageTitle()).toEqual('ParaBank | Accounts Overview');  
 
});

test.afterAll(async () => {
  await context.close();
});