import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { ChatItemsState } from "../../states/chat-items.state";
import { ChatItems } from "../../actions/chat-items.actions";
import { UserInfoService } from "../../../user/service/user-info.service";
import { StateStatus } from "../../../request/common/models/state-status";
import { FormControl } from "@angular/forms";
import { debounceTime, filter, startWith, switchMap } from "rxjs/operators";
import { ChatItem } from "../../models/chat-item";
import FetchItems = ChatItems.FetchItems;
import FilterRequests = ChatItems.FilterRequests;
import AppendItems = ChatItems.AppendItems;

@Component({
  styleUrls: ['./chat-view.component.scss'],
  templateUrl: './chat-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatViewComponent implements OnInit {

  @Select(ChatItemsState.items) items$: Observable<ChatItem[]>;
  @Select(ChatItemsState.status) status$: Observable<StateStatus>;
  readonly search = new FormControl();
  readonly pageSize = 25;
  fullListLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private userInfoService: UserInfoService) {
  }

  ngOnInit(): void {
    // Поиск
    this.search.valueChanges.pipe(debounceTime(300)).subscribe(requestNameOrNumber => {
      this.store.dispatch(
        new FilterRequests(this.userInfoService.getUserRole(), 0, this.pageSize, { requestNameOrNumber })
      );
    });

    this.store.dispatch(new FetchItems(this.userInfoService.getUserRole(), 0, this.pageSize));

    // Редирект на первую заявку если не выбрано
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith(0),
      switchMap(() => this.items$.pipe(filter(items => items?.length > 0))),
      filter(() => !this.route.firstChild?.snapshot.params.requestId),
    ).subscribe(([{ request }]) => {
      this.router.navigate(['.', request.id], {relativeTo: this.route});
    });
  }

  append() {
    const startFrom = this.store.selectSnapshot(ChatItemsState.items).length;
    this.store.dispatch(new AppendItems(this.userInfoService.getUserRole(), startFrom, this.pageSize))
      .subscribe(() => this.fullListLoaded = startFrom + this.pageSize > this.store.selectSnapshot(ChatItemsState.items).length);
  }
}
