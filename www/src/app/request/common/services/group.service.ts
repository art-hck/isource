import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";
import {RequestPositionList} from "../models/request-position-list";
import { RequestGroup } from "../models/request-group";
import { GroupWithPositions } from "../models/groupWithPositions";


@Injectable()
export class GroupService {

  constructor(
    protected api: HttpClient
  ) {
  }

  saveGroup(id: Uuid, name: string) {
    return this.api.post<RequestGroup>(`requests/${id}/add-group`, { name });
  }

  addPositionsInGroup(id: Uuid, groupId: Uuid, selectedPositions: RequestPositionList[]) {
    const ids = [];
    for (const selectedPosition of selectedPositions) {
      ids.push(selectedPosition.id);
    }
    return this.api.post<GroupWithPositions>(`requests/${id}/groups/add-positions`, {
      groupId: groupId,
      positions: ids
    });
  }
}
