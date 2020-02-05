import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users-routing.module';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserListViewComponent } from "./components/user-list-view/user-list-view.component";
import { UsersService } from "./services/users.service";
import { UserCardComponent } from './components/user-card/user-card.component';
import { UserCardRequestListComponent } from './components/user-card/user-card-request-list/user-card-request-list.component';
import { UserCardPositionListComponent } from './components/user-card/user-card-position-list/user-card-position-list.component';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    UsersRoutingModule
  ],
  declarations: [
    UserListViewComponent,
    UserListComponent,
    UserCardComponent,
    UserCardRequestListComponent,
    UserCardPositionListComponent
  ],
  providers: [
    UsersService,
  ],
  exports: [
    UserCardComponent,
  ]
})
export class UsersModule { }
