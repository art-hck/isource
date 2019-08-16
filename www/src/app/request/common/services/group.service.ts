import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";


@Injectable()
export class GroupService {

  constructor(
    protected api: HttpClient
  ) {
  }

  saveGroup(id: Uuid, groupName: string) {
    return this.api.post(`requests/${id}/add-group`, {
      name: groupName
    });
  }

}
