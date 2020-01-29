import { Component, OnInit } from '@angular/core';
import { Uuid } from "../../../../../../cart/models/uuid";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { UserListItem } from "../../models/user-list-item";
import { UsersService } from "../../services/users.service";
import { Title } from "@angular/platform-browser";
import { tap } from "rxjs/operators";
import { UxgBreadcrumbsService } from "uxg";

@Component({
  selector: 'app-user-card-view',
  templateUrl: './user-card-view.component.html',
  styleUrls: ['./user-card-view.component.scss']
})
export class UserCardViewComponent implements OnInit {

  userId: Uuid;
  contragent$: Observable<UserListItem>;

  constructor(
    private bc: UxgBreadcrumbsService,
    private title: Title,
    private route: ActivatedRoute,
    protected staffService: UsersService
  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');

    console.log(this.userId);

    // this.getUserInfo(this.userId);
  }

  getUserInfo(userId: Uuid): void {
    this.contragent$ = this.staffService.getUserInfo(userId).pipe(
      tap(user => {
        this.title.setTitle(user.user.fullName);
        this.bc.breadcrumbs = [
          {label: "Сотрудники", link: "/users/list"},
          {label: this.title.getTitle(), link: `/users/${user.user.id}/info`}
        ];
      })
    );
  }

}
