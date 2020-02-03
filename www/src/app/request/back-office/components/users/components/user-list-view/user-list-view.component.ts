import { Component, OnInit } from '@angular/core';
import { UsersService } from "../../services/users.service";
import { UserItem } from "../../models/user-item";

@Component({
  selector: 'app-user-list-view',
  templateUrl: './user-list-view.component.html',
  styleUrls: ['./user-list-view.component.css']
})
export class UserListViewComponent implements OnInit {

  backoffice: UserItem[] = [];
  seniorBackoffice: UserItem[] = [];

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
