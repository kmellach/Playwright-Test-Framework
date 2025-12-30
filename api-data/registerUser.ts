import { Page } from 'playwright';
import { faker } from '@faker-js/faker';

export class Registration {
  private page: Page;
  private cookie: string;

  constructor(page: Page) {
    this.page = page;
    this.cookie = ''; 
  }

  private async getFreshSessionCookie(): Promise<void> {
    await this.page.goto('https://parabank.parasoft.com/parabank/register.htm');
    await this.page.waitForLoadState('domcontentloaded');
    const cookies = await this.page.context().cookies();
    const sessionCookie = cookies.find(cookie => cookie.name === 'JSESSIONID');

    if (sessionCookie) {
      this.cookie = sessionCookie.value;
    } else {
      throw new Error('JSESSIONID cookie not found');
    }
  }

  // Generate fake registration data
  public generateRegistrationData(): URLSearchParams {
    const formData = new URLSearchParams();
    formData.append('firstName', faker.person.firstName());
    formData.append('lastName', faker.person.lastName());
    formData.append('street', faker.location.street());
    formData.append('city', faker.location.city());
    formData.append('state', faker.location.state());
    formData.append('ssn', faker.number.int({ min: 10000, max: 99999 }).toString()); 
    formData.append('zipCode', faker.location.zipCode());
    formData.append('username', faker.internet.username());
    formData.append('password', faker.internet.password());
    formData.append('confirmPassword', formData.get('password')!);

    console.log('Generated Registration Data:', formData.toString());

    return formData;
  }


  public async submitRegistration(formData: URLSearchParams): Promise<{ status: number; data: URLSearchParams }> { 
    await this.getFreshSessionCookie();

    const response = await this.page.request.post('https://parabank.parasoft.com/parabank/register.htm', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': `JSESSIONID=${this.cookie}`,
        'Origin': 'https://parabank.parasoft.com',
        'Referer': 'https://parabank.parasoft.com/parabank/register.htm',
      },
      data: formData
    });

    const status = response.status();

    if (status !== 200) {
        throw new Error(`Registration failed with status: ${status}`);
    }

    console.log('Registration successful!');
    
    return { status, data: formData };
}

}
