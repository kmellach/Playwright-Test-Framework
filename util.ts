import { Page } from "playwright";

export class Util{
    private page: Page; 

    constructor(page: Page) {
        this.page= page;
    }
    public async takeScreenshot(){
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotPath = `screenshots/homepage_${timestamp}.png`;
        await this.page.screenshot({ path: screenshotPath })
    }

    public async closePage(page: Page): Promise<void> {
        await page.close();
      }

      public async getPageTitle(): Promise<string>{
        await this.page.waitForLoadState('load');
        return await this.page.title();
      }
}