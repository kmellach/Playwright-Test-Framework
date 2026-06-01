import { test, expect } from '../fixtures';
import { Util } from '../util'; 
import { RegistrationPage } from '../page-objects/registration.po';
import { LoginPage } from '../page-objects/login.po';
import { HomePage } from '../page-objects/home.po';

let formData: URLSearchParams;

test.describe.serial('User Registration and Login', () => {

  test('create user through registration portal', async ({ page }) => {
    const util = new Util(page);
    const registration = new RegistrationPage(page);
    
    await registration.clickRegisterOnHomePage();
    formData = await registration.fillRegistrationData();
    await registration.submitRegistration();

    await util.takeScreenshot();
    await expect(page).toHaveTitle('ParaBank | Customer Created');
  });

  test('login with registered user', async ({ page }) => {
    const util = new Util(page);
    const login = new LoginPage(page);
    
    await login.fillLoginData(formData);
    await login.submitLogin();

    await util.takeScreenshot();
    await expect(page).toHaveTitle('ParaBank | Accounts Overview');
  });

  test('post-login: welcome message displays username', async ({ page }) => {
    const util = new Util(page);
    const login = new LoginPage(page);
    const home = new HomePage(page);

    
    await login.fillLoginData(formData);
    await login.submitLogin();

    await util.takeScreenshot();
    const welcome = await home.welcomeText();
    await expect(welcome).toContain('Welcome');
  });

  test('post-login: accounts list is present', async ({ page }) => {
    const util = new Util(page);
    const login = new LoginPage(page);
    const home = new HomePage(page);

    
    await login.fillLoginData(formData);
    await login.submitLogin();

    await util.takeScreenshot();
    const count = await home.accountLinkCount();
    await expect(count).toBeGreaterThan(0);
  });

  test('post-login: navigation links and logout visible', async ({ page }) => {
    const util = new Util(page);
    const login = new LoginPage(page);
    const home = new HomePage(page);

    
    await login.fillLoginData(formData);
    await login.submitLogin();

    await util.takeScreenshot();
    await expect(await home.isTransferFundsVisible()).toBeTruthy();
    await expect(await home.isLogoutVisible()).toBeTruthy();
  });

});
