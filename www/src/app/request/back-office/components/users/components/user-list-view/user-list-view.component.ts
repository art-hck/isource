import { Component, OnInit } from '@angular/core';
import { UsersService } from "../../services/users.service";
import { UserList } from "../../models/user-list";
import { Observable } from "rxjs";
import { DatagridStateAndFilter } from "../../../../../common/models/datagrid-state-and-filter";

@Component({
  selector: 'app-user-list-view',
  templateUrl: './user-list-view.component.html',
  styleUrls: ['./user-list-view.component.css']
})
export class UserListViewComponent implements OnInit {

  currentDatagridState: DatagridStateAndFilter;

  users$: Observable<UserList[]>;


  users = {
    purchasers: [
      {
        "user": {
          "id": "ffb02f77-66a1-44ac-b19d-64596239f3e4",
          "username": "testbackoffice@mail.ru",
          "firstName": null,
          "lastName": null,
          "middleName": null,
          "fullName": " ",
          "shortName": " "
        },
        "poscount": 4,
        "reqcount": 1
      },
      {
        "user": {
          "id": "18313c38-78f0-4819-bd79-c41444305134",
          "username": "gareev.ar@gazprom-neft.ru",
          "firstName": "Афхат",
          "lastName": "Гареев",
          "middleName": "Рамилевич",
          "fullName": "Гареев Афхат Рамилевич",
          "shortName": "Гареев А. Р."
        },
        "poscount": 0,
        "reqcount": 0
      },
      {
        "user": {
          "id": "6aa64e48-a55e-4056-a48d-10a16044f695",
          "username": "potapovdv.gpns@mail.ru",
          "firstName": "Дмитрий",
          "lastName": "Потапов",
          "middleName": "Владимирович",
          "fullName": "Потапов Дмитрий Владимирович",
          "shortName": "Потапов Д. В."
        },
        "posCount": 0,
        "reqCount": 0
      }
    ],
    managers: [
      {
        "user": {
          "id": "ffb02f77-66a1-44ac-b19d-64596239f3e4",
          "username": "testbackoffice@mail.ru",
          "firstName": null,
          "lastName": null,
          "middleName": null,
          "fullName": " ",
          "shortName": " "
        },
        "poscount": 4,
        "reqcount": 1
      },
      {
        "user": {
          "id": "18313c38-78f0-4819-bd79-c41444305134",
          "username": "gareev.ar@gazprom-neft.ru",
          "firstName": "Афхат",
          "lastName": "Гареев",
          "middleName": "Рамилевич",
          "fullName": "Гареев Афхат Рамилевич",
          "shortName": "Гареев А. Р."
        },
        "poscount": 0,
        "reqcount": 0
      },
      {
        "user": {
          "id": "6aa64e48-a55e-4056-a48d-10a16044f695",
          "username": "potapovdv.gpns@mail.ru",
          "firstName": "Дмитрий",
          "lastName": "Потапов",
          "middleName": "Владимирович",
          "fullName": "Потапов Дмитрий Владимирович",
          "shortName": "Потапов Д. В."
        },
        "posCount": 0,
        "reqCount": 0
      }
    ],
  };

  purchasersCount: number;
  managersCount: number;

  constructor(
    protected usersService: UsersService
  ) { }

  ngOnInit() {
    this.getUserList('purchasers');

    this.purchasersCount = this.users.purchasers.length;
    this.managersCount = this.users.managers.length;
  }

  getUserList(type): UserList[] {
    // this.users$ = this.usersService.getUserList();
    return this.users[type];
  }

}
