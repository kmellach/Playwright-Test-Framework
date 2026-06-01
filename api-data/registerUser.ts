import { APIResponse, Page } from 'playwright';
import { full, BASE_URL } from '../env';
import { faker } from '@faker-js/faker';

export class Registration {
  private page: Page;
  private cookie: string;

  constructor(page: Page) {
    this.page = page;
    this.cookie = ''; 
  }

  private async getFreshSessionCookie(): Promise<void> {
    await this.page.goto(full('/parabank/register.htm'));
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
    formData.append('repeatedPassword', formData.get('password')!);

    console.log('Generated Registration Data:', formData.toString());

    return formData;
  }

  // Register using API: GET registration page to obtain JSESSIONID, then POST mapped form fields
  public async submitRegistrationApi(formData: URLSearchParams): Promise<{ status: number; data: URLSearchParams; session?: string }> {
    await this.getFreshSessionCookie();

    const payload = new URLSearchParams();
    payload.append('customer.firstName', formData.get('firstName')!);
    payload.append('customer.lastName', formData.get('lastName')!);
    payload.append('customer.address.street', formData.get('street')!);
    payload.append('customer.address.city', formData.get('city')!);
    payload.append('customer.address.state', formData.get('state')!);
    payload.append('customer.ssn', formData.get('ssn')!);
    payload.append('customer.address.zipCode', formData.get('zipCode')!);
    payload.append('customer.username', formData.get('username')!);
    payload.append('customer.password', formData.get('password')!);
    payload.append('repeatedPassword', formData.get('repeatedPassword')!);

    const response = await this.page.request.post(full('/parabank/register.htm'), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': `JSESSIONID=${this.cookie}`,
        'Origin': BASE_URL,
        'Referer': full('/parabank/register.htm'),
      },
      data: payload.toString(),
    });

    const status = response.status();
    if (status !== 200) {
      console.log('Registration API response status:', status);
      console.log(await response.text());
    }

    // return session id so caller can reuse it for login
    return { status, data: formData, session: this.cookie };
  }

  private parseSessionCookieFromResponse(resp: APIResponse): string | undefined {
    const setCookieHeaders = resp.headersArray()
      .filter((header) => header.name.toLowerCase() === 'set-cookie')
      .map((header) => header.value);

    for (const headerValue of setCookieHeaders) {
      const match = headerValue.match(/JSESSIONID=([^;]+)/);
      if (match) {
        return match[1];
      }
    }

    return undefined;
  }

  // Login via API using an existing JSESSIONID
  public async loginViaApi(sessionId: string, username: string, password: string): Promise<{ status: number; body: string; session?: string }> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': `JSESSIONID=${sessionId}`,
      'Origin': BASE_URL,
      'Referer': full('/parabank/index.htm'),
    };

    const loginData = new URLSearchParams();
    loginData.append('username', username);
    loginData.append('password', password);
    loginData.append('submit', 'Log In');

    const resp = await this.page.request.post(full('/parabank/login.htm'), {
      headers,
      data: loginData.toString(),
      followRedirects: false,
    });

    const status = resp.status();
    const body = await resp.text();
    const newSession = this.parseSessionCookieFromResponse(resp) ?? sessionId;
    return { status, body, session: newSession };
  }


  public async submitRegistration(formData: URLSearchParams): Promise<{ status: number; data: URLSearchParams; session?: string }> { 
    // Prefer API-based registration; fall back to browser form if API path fails
    try {
      const apiResp = await this.submitRegistrationApi(formData);
      if (apiResp && apiResp.status === 200) {
        console.log('Registration successful (API)!');
        return apiResp;
      }
      console.log('API registration did not return 200, falling back to UI registration');
    } catch (err) {
      console.log('API registration failed, falling back to UI registration:', err);
    }

    // Browser-based registration fallback
    await this.page.goto(full('/parabank/register.htm'));
    await this.page.fill('[name="customer.firstName"]', formData.get('firstName')!);
    await this.page.fill('[name="customer.lastName"]', formData.get('lastName')!);
    await this.page.fill('[name="customer.address.street"]', formData.get('street')!);
    await this.page.fill('[name="customer.address.city"]', formData.get('city')!);
    await this.page.fill('[name="customer.address.state"]', formData.get('state')!);
    await this.page.fill('[name="customer.ssn"]', formData.get('ssn')!);
    await this.page.fill('[name="customer.address.zipCode"]', formData.get('zipCode')!);
    await this.page.fill('[name="customer.username"]', formData.get('username')!);
    await this.page.fill('[name="customer.password"]', formData.get('password')!);
    await this.page.fill('[name="repeatedPassword"]', formData.get('repeatedPassword')!);
    await this.page.click('[value="Register"]');

    // Wait for navigation/response
    await this.page.waitForLoadState('domcontentloaded');
    const title = await this.page.title();
    const success = title.includes('Customer Created');

    if (!success) {
      const body = await this.page.content();
      throw new Error('Registration (browser) did not reach success page. Current title: ' + title + '\nBody snippet: ' + body.slice(0, 200));
    }

    // update cookie value from context
    const cookies = await this.page.context().cookies();
    const sessionCookie = cookies.find(c => c.name === 'JSESSIONID');
    if (sessionCookie) this.cookie = sessionCookie.value;

    console.log('Registration successful (UI fallback)!');
    return { status: 200, data: formData, session: this.cookie };
}

}
