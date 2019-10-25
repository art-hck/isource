import {LoginPage} from '../../pages/login.po';
import {browser, protractor} from "protractor";
import {Login} from "./login";

let loginData = require("../../test-data/login-data");

describe('Логин', () => {

  const EC = protractor.ExpectedConditions;
  let login = new Login();

  beforeEach(() => {
    browser.get(browser.baseUrl);
  });

  it('Отображение страница логина', () => {
    expect(LoginPage.welcomeMessage().getText()).toEqual('Добро пожаловать в');
    expect(LoginPage.reqLink().getText()).toEqual(('Нет аккаунта? Зарегистрироваться'));
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/login');
  });

  it('Успешный логин бэкофисом', () => {

    login.login('backoffice');
    browser.wait(EC.visibilityOf(LoginPage.requestListTitle()));
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/requests/backoffice');
    expect(LoginPage.menuItems().getText()).toEqual(loginData.backoffice.menuItems);
    expect(LoginPage.usernameButton().getText()).toEqual(browser.params.login.backoffice.user);
  });

  it('Успешный выход бэкофисом', () => {
    login.logout();
    browser.sleep(1000);
    expect(LoginPage.welcomeMessage().getText()).toEqual('Добро пожаловать в');
  });

  it('Успешный логин заказчиком', () => {
    login.login('customer');
    browser.wait(EC.visibilityOf(LoginPage.requestListTitle()));
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/requests/customer');
    expect(LoginPage.menuItems().getText()).toEqual(loginData.customer.menuItems);
    expect(LoginPage.usernameButton().getText()).toEqual(browser.params.login.customer.user);
  });

  it('Успешный выход заказчиком', () => {
    login.logout();
    browser.sleep(1000);
    expect(LoginPage.welcomeMessage().getText()).toEqual('Добро пожаловать в');
  });
});
