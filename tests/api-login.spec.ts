import { test, expect } from '../fixtures';
import { Registration } from '../api-data/registerUser';
import { full, BASE_URL } from '../env';

test.describe('API Registration and Login', () => {

  test('register via API then login via API (POST) returns 200', async ({ page }) => {
    const registration = new Registration(page);
    const formData = registration.generateRegistrationData();

    const regResp = await registration.submitRegistration(formData);
    const sessionId = regResp.session;
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': BASE_URL,
      'Referer': full('/parabank/index.htm'),
    };
    if (sessionId) {
      headers['Cookie'] = `JSESSIONID=${sessionId}`;
    }

    const loginData = new URLSearchParams();
    loginData.append('username', formData.get('username')!);
    loginData.append('password', formData.get('password')!);
    loginData.append('submit', 'Log In');

    const resp = await page.request.post(full('/parabank/login.htm'), {
      headers,
      data: loginData.toString(),
    });

    if (resp.status() !== 200 && resp.status() !== 302) {
      console.log('Login response status:', resp.status());
      console.log(await resp.text());
    }
    expect([200, 302]).toContain(resp.status());
  });

});
