export enum UserRole {
  // Системные роли
  CUSTOMER   = "CUSTOMER",
  BACKOFFICE = "BACKOFFICE",
  SUPPLIER   = "SUPPLIER",
  ADMIN      = 'ADMIN',

  // Пользовательские роли
  // Роли заказчика
  CUSTOMER_BUYER = 'CUSTOMER_BUYER',

  // Роли БО
  BACKOFFICE_BUYER = 'BACKOFFICE_BUYER',
  SENIOR_BACKOFFICE = "SENIOR_BACKOFFICE",

  // Другое
  CONTRAGENT_CREATOR = "CONTRAGENT_CREATOR"
}
