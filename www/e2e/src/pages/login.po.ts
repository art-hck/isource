import { by, element } from 'protractor';

export class LoginPage {
  public static welcomeMessage() {
    return element(by.className('welcome'));
  }

  public static reqLink() {
    return element(by.className('signup'));
  }

  public static usernameInput() {
    return element(by.name('username'));
  }

  public static passwordInput() {
    return element(by.name('password'));
  }

  public static loginButton() {
    return element(by.buttonText('Войти'));
  }

  public static requestListTitle() {
    return element(by.className('newRequest'));
  }

  public static usernameButton() {
    return element(by.className('user-name'));
  }

  public static logoutButton() {
    return element(by.buttonText('Выход'));
  }

  public static menuItems () {
    return element.all(by.className('nav-link'));
  }
}
