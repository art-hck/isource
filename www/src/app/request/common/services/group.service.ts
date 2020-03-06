import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";
import { RequestGroup } from "../models/request-group";
import { GroupWithPositions } from "../models/groupWithPositions";


@Injectable()
export class GroupService {

  constructor(private api: HttpClient) {}

  saveGroup(id: Uuid, name: string) {
    return this.api.post<RequestGroup>(`requests/${id}/add-group`, { name });
  }

  addPositionsInGroup(id: Uuid, groupId: Uuid, positions: Uuid[]) {
    return this.api.post<GroupWithPositions>(`requests/${id}/groups/add-positions`, { groupId, positions });
  }

  removePositionsFromGroup(requestId: Uuid, groupId: Uuid, positions: Uuid[]) {
    return this.api.post<GroupWithPositions>(`requests/${requestId}/groups/remove-positions`, { groupId, positions });
  }
}
