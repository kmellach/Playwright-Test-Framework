import { Locator, Page } from "playwright";
import { Registration } from '../api-data/registerUser';
import { GenericPage } from "./page-generic.po";

export class RegistrationPage {
    private username: Locator;
    private password: Locator;
    private registerButtonOnHomePage: Locator  
    private firstName:Locator 
    private lastName:Locator   
    private street:Locator 
    private city:Locator 
    private state:Locator 
    private ssn:Locator 
    private confirmPassword:Locator 
    private registerButton:Locator 
    private zipCode:Locator 
    private page: Page;
    private genericPage: GenericPage;
    private registrationPage: Registration;

  constructor(page: Page) {
    this.username = page.locator('[name="customer.username"]');
    this.password = page.locator('[name="customer.password"]');
    this.registerButton = page.locator('[value="Register"]');
    this.registerButtonOnHomePage = page.locator('text="Register"');
    this.firstName =  page.locator('[name="customer.firstName"]');
    this.lastName = page.locator('[name="customer.lastName"]');
    this.street =  page.locator('[name="customer.address.street"]');
    this.city = page.locator('[name="customer.address.city"]');
    this.state =  page.locator('[name="customer.address.state"]');
    this.ssn =   page.locator('[name="customer.ssn"]');
    this.confirmPassword = page.locator('[name="repeatedPassword"]');
    this.zipCode =  page.locator('[name="customer.address.zipCode"]');
    this.page=page;
    this.genericPage = new GenericPage();
    this.registrationPage = new Registration(this.page);

  }

  public async fillRegistrationData(): Promise<URLSearchParams> {
    const formData = await this.registrationPage.generateRegistrationData(); 
    await this.username.fill(formData.get('username')!); 
    await this.password.fill(formData.get('password')!); 
    await this.firstName.fill(formData.get('firstName')!);
    await this.lastName.fill(formData.get('lastName')!);
    await this.street.fill(formData.get('street')!);
    await this.city.fill(formData.get('city')!);
    await this.state.fill(formData.get('state')!);
    await this.ssn.fill(formData.get('ssn')!);
    await this.zipCode.fill(formData.get('zipCode')!);
    await this.confirmPassword.fill(formData.get('repeatedPassword')!);
    return formData;
    
  }


  public async clickRegisterOnHomePage(): Promise<void> {
    await this.genericPage.clickButton(this.registerButtonOnHomePage);
  }

  public async submitRegistration(): Promise<void> {
    await this.genericPage.clickButton(this.registerButton); 
  }


}
