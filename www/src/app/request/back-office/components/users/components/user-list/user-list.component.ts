import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";
import { DatagridStateAndFilter } from "../../../../../common/models/datagrid-state-and-filter";
import { UserListItem } from "../../models/user-list-item";
import { Uuid } from "../../../../../../cart/models/uuid";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @Output() datagridState = new EventEmitter<DatagridStateAndFilter>();

  @Input() searchValue: string;
  @Input() users: UserListItem[];

  constructor(
    protected router: Router,
  ) { }

  ngOnInit() {
  }

  onRowClick(userId: Uuid): void {
    this.router.navigateByUrl(`/user/${userId}/info`);
  }
}
