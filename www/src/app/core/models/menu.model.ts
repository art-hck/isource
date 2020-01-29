export interface MenuModel {
  text: string;
  path: string;
  children: Array<MenuModel>;
  feature?: string;
}

export const Menu: MenuModel[] = [
  {
    text: 'Заявки',
    path: 'requests/customer',
    feature: 'customerRequest',
    children: []
  },
  {
    text: 'Заявки',
    path: 'requests/backoffice',
    feature: 'backofficeRequest',
    children: []
  },
  {
    text: 'Создать заявку',
    path: 'requests/create',
    feature: 'createRequest',
    children: []
  },
  {
    text: 'Каталог',
    path: 'catalog',
    feature: 'catalog',
    children: []
  },
  {
    text: 'Контрагенты',
    path: 'contragents',
    children: []
  },
  {
    text: 'Сотрудники',
    path: 'users',
    feature: 'users',
    children: []
  }
];
