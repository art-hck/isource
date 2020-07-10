import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "../models/user";
import { Uuid } from "../../cart/models/uuid";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getRegularBackofficeUsers() {
    const url = `users/regular-backoffice-users-list`;

    return this.http.get<User[]>(url);
  }

  getCustomerBuyerUsersWithoutContragent() {
    const url = `users/customer-buyer-users-without-contragent-list`;

    return this.http.get<User[]>(url);
  }

  addContragentToUser(contragentId: Uuid, userId: Uuid) {
    return this.http.post('users/add-contragent-to-user', { contragentId, userId });
  }
}
