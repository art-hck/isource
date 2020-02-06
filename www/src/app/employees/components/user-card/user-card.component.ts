import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from "../../services/users.service";
import { UserInfo, UserInfoBrief, UserInfoRequestItem } from "../../models/user-info";
import { UxgBreadcrumbsService } from "uxg";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { Uuid } from "../../../cart/models/uuid";
import { UserListRequestPosition } from "../../../request/common/models/user-list-request-position";

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  @Input() userCardInfo: UserInfo;

  userId: Uuid;

  user: UserInfoBrief;

  requestList: UserInfoRequestItem[];
  positionsList: UserListRequestPosition[];

  requestCount: number;
  positionCount: number;

  constructor(
    private bc: UxgBreadcrumbsService,
    private title: Title,
    private route: ActivatedRoute,
    protected usersService: UsersService
  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.getUserInfo(this.userId);
  }

  getUserInfo(userId: Uuid): void {
    const subscription = this.usersService.getUserInfo(userId).subscribe((userCardInfo) => {
      this.requestList = userCardInfo.requests;
      this.positionsList = userCardInfo.positions;
      this.user = userCardInfo.user;

      this.bc.breadcrumbs = [
        { label: "Сотрудники", link: "/employees" },
        { label: userCardInfo.user.fullName, link: `/employees/${userCardInfo.user.id}/info` }
      ];

      this.requestCount = this.requestList ? (this.requestList.length || 0) : null;
      this.positionCount = this.positionsList ? this.positionsList.length : 0;

      subscription.unsubscribe();
    });
  }

}
