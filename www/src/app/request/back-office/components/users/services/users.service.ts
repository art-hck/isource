import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserInfo } from "../models/user-info";
import { Uuid } from "../../../../../cart/models/uuid";
import { UserItem } from "../models/user-item";

@Injectable()
export class UsersService {

  loading = false;

  constructor(
    protected api: HttpClient
  ) {
  }

  getUserList(type): Observable<UserItem[]> {
    return this.api.post<UserItem[]>(`requests/backoffice/users`, { role: type });
  }

  getUserInfo(id: Uuid): Observable<UserInfo> {
    return this.api.get<UserInfo>(`requests/backoffice/users/${id}`);
  }
}
