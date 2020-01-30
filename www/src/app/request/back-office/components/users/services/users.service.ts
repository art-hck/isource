import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserList } from "../models/user-list";
import { Uuid } from "../../../../../cart/models/uuid";
import { UserListItem } from "../models/user-list-item";

@Injectable()
export class UsersService {

  loading = false;

  constructor(
    protected api: HttpClient
  ) {
  }

  getUserList(type): Observable<UserList[]> {
    console.log('asdasdasd');
    return this.api.post<UserList[]>(`user`, { type });
  }

  getUserInfo(id: Uuid): Observable<UserListItem> {
    return this.api.get<UserListItem>(`user/${id}/info`);
  }
}
