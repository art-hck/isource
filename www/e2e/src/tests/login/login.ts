import { LoginPage } from "../../pages/login.po";
import { browser } from "protractor";

export class Login {
  username: string;
  password: string;

  login(role: string) {
    if (role === 'customer') {
      this.username = browser.params.login.customer.username;
      this.password = browser.params.login.customer.password;
    } else {
      this.username = browser.params.login.backoffice.username;
      this.password = browser.params.login.backoffice.password;
    }

    LoginPage.usernameInput().sendKeys(this.username);
    LoginPage.passwordInput().sendKeys(this.password);
    LoginPage.loginButton().click();
  }

  logout() {
    LoginPage.usernameButton().click();
    LoginPage.logoutButton().click();
  }
}
