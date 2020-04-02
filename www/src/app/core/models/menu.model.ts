import { FeatureList } from "../config/feature-list";

export interface MenuModel {
  text: string;
  path: string;
  children: Array<MenuModel>;
  feature?: keyof typeof FeatureList;
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
    path: 'employees',
    feature: 'employees',
    children: []
  },
  {
    text: 'Торговый портал',
    path: 'kim',
    feature: 'kim',
    children: []
  }
];
