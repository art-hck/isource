import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users-routing.module';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { SharedModule } from "../../../../shared/shared.module";
import { UserListViewComponent } from "./components/user-list-view/user-list-view.component";
import { UsersService } from "./services/users.service";
import { UserCardComponent } from './components/user-card/user-card.component';
import { UserCardViewComponent } from "./components/user-card-view/user-card-view.component";

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
    UserCardViewComponent
  ],
  providers: [
    UsersService,
  ],
  exports: [
    UserCardComponent,
  ]
})
export class UsersModule { }
