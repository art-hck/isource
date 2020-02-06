import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";
import { UserItem } from "../../models/user-item";
import { DatagridStateAndFilter } from "../../../request/common/models/datagrid-state-and-filter";
import { Uuid } from "../../../cart/models/uuid";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @Output() datagridState = new EventEmitter<DatagridStateAndFilter>();

  @Input() searchValue: string;
  @Input() users: UserItem[];

  constructor(
    protected router: Router,
  ) { }

  ngOnInit() {
  }

  onRowClick(userId: Uuid): void {
    this.router.navigateByUrl(`/employees/${userId}/info`);
  }
}
