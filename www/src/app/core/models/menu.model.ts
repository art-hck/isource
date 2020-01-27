import { UserRole } from "../../user/models/user-role";

export interface MenuModel {
  text: string;
  path: string;
  children: Array<MenuModel>;
}

export const Menu: { [key in UserRole]: MenuModel[] } = {
  [UserRole.CUSTOMER]: [
    {
      text: 'Заявки',
      path: 'requests/customer',
      children: []
    },
    {
      text: 'Индивидуальная заявка',
      path: 'requests/create',
      children: []
    },
    {
      text: 'Каталог',
      path: 'catalog',
      children: []
    },
    {
      text: 'Контрагенты',
      path: 'contragents',
      children: []
    }
  ],
  [UserRole.SENIOR_BACKOFFICE]: [
    {
      text: 'Заявки',
      path: 'requests/backoffice',
      children: []
    },
    {
      text: 'Контрагенты',
      path: 'contragents',
      children: []
    },
    {
      text: 'Сотрудники',
      path: 'employees',
      children: []
    }
  ],
  [UserRole.BACKOFFICE]: [
    {
      text: 'Заявки',
      path: 'requests/backoffice',
      children: []
    },
    {
      text: 'Контрагенты',
      path: 'contragents',
      children: []
    }
  ],
  [UserRole.SUPPLIER]: [
    {
      text: 'Заявки',
      path: 'requests/backoffice',
      children: []
    }
  ]
};
