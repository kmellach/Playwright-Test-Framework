import { Locator } from "playwright";

export class GenericPage{

  public async clickButton(buttonLocator: Locator): Promise<void> {
    await buttonLocator.click();
  }
}