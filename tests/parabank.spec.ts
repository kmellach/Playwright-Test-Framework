import { test, expect } from '@playwright/test';
import { Util } from '../util'; 
import { RegistrationPage } from '../page-objects/registration.po';
import { LoginPage } from '../page-objects/login.po';

let formData: URLSearchParams;

test.describe.serial('User Registration and Login', () => {

  test('create user through registration portal', async ({ page }) => {
    const util = new Util(page);
    const registration = new RegistrationPage(page);

    await page.goto('https://parabank.parasoft.com/parabank/index.htm', {
      waitUntil: 'domcontentloaded'
    });

    await registration.clickRegisterOnHomePage();
    formData = await registration.fillRegistrationData();
    await registration.submitRegistration();

    await util.takeScreenshot();
    await expect(page).toHaveTitle('ParaBank | Customer Created');
  });

  test('login with registered user', async ({ page }) => {
    const util = new Util(page);
    const login = new LoginPage(page);

    await page.goto('https://parabank.parasoft.com/parabank/index.htm', {
      waitUntil: 'domcontentloaded'
    });

    await login.fillLoginData(formData);
    await login.submitLogin();

    await util.takeScreenshot();
    await expect(page).toHaveTitle('ParaBank | Accounts Overview');
  });

});
