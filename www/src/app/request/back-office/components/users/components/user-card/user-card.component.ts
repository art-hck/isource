import { Component, Input } from '@angular/core';
import { UsersService } from "../../services/users.service";
import { UserListItem } from "../../models/user-list-item";

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {

  @Input() user: UserListItem;

  constructor(
    protected usersService: UsersService
  ) { }

  getLoaderState() {
    return this.usersService.loading;
  }

}
