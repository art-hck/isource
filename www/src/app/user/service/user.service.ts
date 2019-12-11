import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getRegularBackofficeUsers() {
    const url = `users/regular-backoffice-users-list`;

    return this.http.get<User[]>(url);
  }
}
