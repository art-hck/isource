import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Uuid } from "../../cart/models/uuid";
import { Group } from "../models/group";

@Injectable()
export class GroupService {

  loading = false;

  constructor(
    protected api: HttpClient
  ) {
  }

  getGroups(): Observable<Group[]> {
    return this.api.get<Group[]>(`groups`);
  }
}
