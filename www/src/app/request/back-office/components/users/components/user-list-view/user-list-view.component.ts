import { Component, OnInit } from '@angular/core';
import { UsersService } from "../../services/users.service";
import { UserList } from "../../models/user-list";
import { Observable } from "rxjs";
import { DatagridStateAndFilter } from "../../../../../common/models/datagrid-state-and-filter";
import { UserListItem } from "../../models/user-list-item";
import { map, publishReplay, refCount } from "rxjs/operators";
import { ContragentList } from "../../../../../../contragent/models/contragent-list";

@Component({
  selector: 'app-user-list-view',
  templateUrl: './user-list-view.component.html',
  styleUrls: ['./user-list-view.component.css']
})
export class UserListViewComponent implements OnInit {

  backoffice: UserListItem[] = [];
  seniorBackoffice: UserListItem[] = [];

  backofficeCount: number;
  seniorBackofficeCount: number;

  constructor(
    protected usersService: UsersService
  ) { }

  ngOnInit() {
    this.getUserList('BACKOFFICE');
    this.getUserList('SENIOR_BACKOFFICE');
  }

  getUserList(type) {
    this.usersService.getUserList(type).subscribe((user) => {
      (type === 'BACKOFFICE') ?
        this.backoffice = user :
        this.seniorBackoffice = user;

      this.backofficeCount = this.backoffice.length;
      this.seniorBackofficeCount = this.seniorBackoffice.length;
    });
  }

}
