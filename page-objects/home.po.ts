import { Locator, Page } from "playwright";

export class HomePage {
  private page: Page;
  private logoutLink: Locator;
  private transferFundsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutLink = page.locator('text="Log Out"');
    this.transferFundsLink = page.locator('text="Transfer Funds"');
  }

  public async welcomeText(): Promise<string | null> {
    const welcome = this.page.locator('text=Welcome').first();
    return (await welcome.textContent())?.trim() ?? null;
  }

  public async isLogoutVisible(): Promise<boolean> {
    return await this.logoutLink.isVisible();
  }

  public async isTransferFundsVisible(): Promise<boolean> {
    return await this.transferFundsLink.isVisible();
  }

  public async accountLinkCount(): Promise<number> {
    const section = this.page.locator('text=Accounts Overview').first();
    const anchors = section.locator('..').locator('a');
    return await anchors.count();
  }

  public async isUsernameDisplayed(username: string | null): Promise<boolean> {
    if (!username) return false;
    const userLocator = this.page.locator(`text="${username}"`);
    return await userLocator.isVisible();
  }

}
