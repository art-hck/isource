import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";
import {RequestPositionList} from "../models/request-position-list";


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

  addPositionsInGroup(id: Uuid, groupId: Uuid, selectedPositions: RequestPositionList[]) {
    const ids = [];
    for (const selectedPosition of selectedPositions) {
      ids.push(selectedPosition.id);
    }
    return this.api.post(`requests/${id}/groups/add-positions`, {
      groupId: groupId,
      positions: ids
    })
  }
}
