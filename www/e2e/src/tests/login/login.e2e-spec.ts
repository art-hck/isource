import { LoginPage } from '../../pages/login.po';
import {browser, by, element, protractor} from "protractor";
import { Login, Role } from "./login";

const loginData = require("../../test-data/login-data");

fdescribe('Логин', async () => {

  const EC = protractor.ExpectedConditions;
  const login = new Login();

  beforeEach(async () => {
    await browser.get(browser.baseUrl);
  });

  it('Отображение страница логина', async () => {
    expect(LoginPage.welcomeMessage().getText()).toEqual('Добро пожаловать');
    expect(LoginPage.reqLink().getText()).toEqual(('Регистрация'));
    expect(LoginPage.forgotPasswordLink().getText()).toEqual('Забыли пароль?');
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/auth/login');
  });

  fit('Успешный логин бэкофисом', async () => {

    login.login(Role.BACKOFFICE);
    //await browser.wait(EC.visibilityOf(element(by.tagName('h1'))));
    expect(await browser.getCurrentUrl()).toEqual(browser.baseUrl + '/requests/backoffice');
    expect(LoginPage.menuItems().getText()).toEqual(loginData.backoffice.menuItems);
    expect(LoginPage.usernameButton().getText()).toEqual(browser.params.login.backoffice.user);
  });

  it('Успешный выход бэкофисом', () => {
    login.logout();
    expect(LoginPage.welcomeMessage().getText()).toEqual('Добро пожаловать');
  });

  it('Успешный логин заказчиком', () => {
    login.login(Role.CUSTOMER);
    browser.wait(EC.visibilityOf(LoginPage.requestListTitle()));
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/requests/customer');
    expect(LoginPage.menuItems().getText()).toEqual(loginData.customer.menuItems);
    expect(LoginPage.usernameButton().getText()).toEqual(browser.params.login.customer.user);
  });

  it('Успешный выход заказчиком', () => {
    login.logout();
    expect(LoginPage.welcomeMessage().getText()).toEqual('Добро пожаловать в');
  });
});
