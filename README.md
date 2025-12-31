Note: I have designed this project with limited knowledge I have got from looking at Playwright official documentation. There are many more things and ideas I have and yet to develop them. Thanks for taking a look! 

**Project Overview**

This project is a UI test automation framework built using Playwright with TypeScript.
It automates key user flows such as User Registration and User Login for a web application.

The framework follows the Page Object Model (POM) design pattern to ensure clean code structure, reusability, and easy maintenance.
Allure Reporting is integrated to generate detailed and visually rich test execution reports.

**Prerequisites**
1. Node.js (v16 or above)
2. npm
3. Allure Commandline installed

**Page Object Model (POM)**
Each application page is represented as a separate class.
Page-specific locators and actions are encapsulated inside page objects.
Test scripts focus only on test logic, improving readability and maintainability.

**Automated Test Scenarios**
1. User Registration
2. User Login

**Reporting**
Allure is used for generating detailed test execution reports.

**Reports include:**
1. Test status (Pass/Fail)
2. Execution timeline
3. Screenshots (on failure, if enabled)
4. Step-wise execution details

**How to Run the Tests**
1. Install Dependencies -- npm install 
2. Run Playwright Tests -- npx playwright test
3. Generate Allure Report -- allure generate allure-results --clean -o allure-report
4. Open Allure Report -- allure open

**Key Features**
1. Modular and scalable framework
2. Clean separation of test logic and UI actions
3. Reusable page objects
4. Detailed test reports using Allure
5. Easy to extend with additional test cases


**Future Enhancements**
1. Add more UI test scenarios
2. Integrate CI/CD pipeline (Jenkins/GitHub Actions)
3. Add cross-browser execution - In Progress
4. Add API testing integration - In Progress

