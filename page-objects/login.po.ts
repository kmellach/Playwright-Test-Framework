import { Locator, Page } from "playwright";
import { Registration } from '../api-data/registerUser';

export class LoginPage {
  private username: Locator;
  private password: Locator;
  private loginButton: Locator;
  private page:Page;

  constructor(page: Page) {
    this.username = page.locator('[name="username"]');
    this.password = page.locator('[name="password"]');
    this.loginButton = page.locator('[value="Log In"]');
    this.page = page;
  }

  public async fillLoginData(formData: URLSearchParams): Promise<void> {
    console.log(`Username: ${formData.get('username')}, Password: ${formData.get('password')}`);

    await this.username.fill(formData.get('username')!);
    await this.page.waitForTimeout(300);
    await this.password.fill(formData.get('password')!);
    await this.page.waitForTimeout(300);

    // Debug: Check filled values
    const enteredUsername = await this.username.inputValue();
    const enteredPassword = await this.password.inputValue();
    console.log(`Entered Username: ${enteredUsername}, Entered Password: ${enteredPassword}`);
}

/*public async fillLoginData(): Promise<void>{
  const formData = await Registration.fillRegistrationData();
}*/

public async submitLogin(): Promise<void> {
    await this.loginButton.focus();
    await this.loginButton.click();
  }

}
