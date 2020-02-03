import { Component, Input, OnInit } from '@angular/core';
import { UserListRequestPosition } from "../../../../../../common/models/user-list-request-position";
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-card-position-list',
  templateUrl: './user-card-position-list.component.html',
  styleUrls: ['./user-card-position-list.component.scss']
})
export class UserCardPositionListComponent implements OnInit {

  @Input() positions: UserListRequestPosition[];

  constructor(
    protected router: Router
  ) { }

  ngOnInit() {
  }

}
