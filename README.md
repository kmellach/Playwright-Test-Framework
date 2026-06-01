Note: I have designed this project with limited knowledge from the Playwright documentation. There are more ideas to build on, and the repository is evolving.

**Project Overview**

This repository is a Playwright + TypeScript automation framework that covers both UI and API test flows for the Parabank sample application.
It uses the Page Object Model (POM) for clean page abstractions, and it includes HTML and Allure reporting for test execution output.

**Prerequisites**
1. Node.js (v16 or above)
2. npm
3. Allure Commandline installed (for Allure report generation)

**Page Object Model (POM)**
Each application page is represented as a separate class.
Page-specific locators and actions are encapsulated inside page objects.
Test scripts focus only on test logic, improving readability and maintainability.

**Automated Test Scenarios**
1. UI: User Registration
2. UI: User Login
3. API: Registration and Login

**Reporting**
HTML and Allure reporters are configured for test execution reporting.

**Reports include:**
1. Test status (Pass/Fail)
2. Execution timeline
3. Screenshots on failure
4. Step-wise execution details

**How to Run the Tests**
1. Install dependencies: `npm install`
2. Run Playwright tests: `npm test`
3. Generate Allure report: `allure generate allure-results --clean -o allure-report`
4. Open Allure report: `allure open`

**Key Features**
1. Modular and scalable automation framework
2. Clean separation of test logic and UI actions
3. Reusable page objects
4. API coverage using Playwright request-based tests
5. Detailed reporting via HTML and Allure

**Current Progress**
1. UI test coverage for registration and login flows
2. API test coverage for registration and login
3. Allure reporting configured
4. Cross browser execution enabled

**Future Enhancements**
1. Add more UI test scenarios
2. Add additional API scenarios
3. Integrate CI/CD pipeline (GitHub Actions / Jenkins)
