import { Component, OnInit } from '@angular/core';
import { UsersService } from "../../services/users.service";
import { UserList } from "../../models/user-list";
import { Observable } from "rxjs";
import { DatagridStateAndFilter } from "../../../../../common/models/datagrid-state-and-filter";
import { UserListItem } from "../../models/user-list-item";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-user-list-view',
  templateUrl: './user-list-view.component.html',
  styleUrls: ['./user-list-view.component.css']
})
export class UserListViewComponent implements OnInit {

  users$: Observable<UserList[]>;

  customers = [
    {
        "user": {
          "id": "ffb02f77-66a1-44ac-b19d-64596239f3e4",
          "username": "testbackoffice@mail.ru",
          "phone": "+7 916 961-63-83",
          "firstName": "Владислав",
          "lastName": "Цыплухин",
          "middleName": "Пресс-секретаревич",
          "fullName": "Цыплухин Владислав Пресс-секретаревич",
          "shortName": "Цыплухин В. П."
        },
        "posCount": 7,
        "reqCount": 12
      },
    {
      "user": {
        "id": "18313c38-78f0-4819-bd79-c41444305134",
        "username": "gareev.ar@gazprom-neft.ru",
        "phone": "+7 905 238-13-42",
        "firstName": "Афхат",
        "lastName": "Гареев",
        "middleName": "Рамилевич",
        "fullName": "Гареев Афхат Рамилевич",
        "shortName": "Гареев А. Р."
      },
      "posCount": 13,
      "reqCount": 64
    },
    {
      "user": {
      "id": "6aa64e48-a55e-4056-a48d-10a16044f695",
        "username": "potapovdv.gpns@mail.ru",
        "phone": "+7 925 538-83-82",
        "firstName": "Дмитрий",
        "lastName": "Потапов",
        "middleName": "Владимирович",
        "fullName": "Потапов Дмитрий Владимирович",
        "shortName": "Потапов Д. В."
    },
      "posCount": 0,
      "reqCount": 0
    }
  ];

  backoffice = [
    {
      "user": {
        "id": "ffb02f77-66a1-44ac-b19d-64596239f3e4",
        "username": "testbackoffice@mail.ru",
        "phone": "+7 911 921-33-63",
        "firstName": "Андрей",
        "lastName": "Круассан",
        "middleName": "Гвоздь",
        "fullName": "Андрей Круассан Гвоздь",
        "shortName": "Круассан А. Г."
      },
      "posCount": 4,
      "reqCount": 13
    },
    {
      "user": {
        "id": "18313c38-78f0-4819-bd79-c41444305134",
        "username": "gareev.ar@gazprom-neft.ru",
        "phone": "+7 905 238-13-42",
        "firstName": "Афхат",
        "lastName": "Гареев",
        "middleName": "Рамилевич",
        "fullName": "Гареев Афхат Рамилевич",
        "shortName": "Гареев А. Р."
      },
      "posCount": 7,
      "reqCount": 34
    },
    {
      "user": {
        "id": "6aa64e48-a55e-4056-a48d-10a16044f695",
        "username": "potapovdv.gpns@mail.ru",
        "phone": "+7 925 538-83-82",
        "firstName": "Дмитрий",
        "lastName": "Потапов",
        "middleName": "Владимирович",
        "fullName": "Потапов Дмитрий Владимирович",
        "shortName": "Потапов Д. В."
      },
      "posCount": 64,
      "reqCount": 128
    }
  ];

  customersCount: number;
  backofficeCount: number;

  constructor(
    protected usersService: UsersService
  ) { }

  ngOnInit() {
    this.getUserList('customers');

    this.customersCount = this.customers.length;
    this.backofficeCount = this.backoffice.length;
  }

  getUserList(type): UserListItem[] {
    this.users$ = this.usersService.getUserList(type);

    if (type === 'customers') {
      return this.customers;
    } else if (type === 'backoffice') {
      return this.backoffice;
    }
  }

}
