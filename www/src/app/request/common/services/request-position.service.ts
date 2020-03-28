import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Uuid } from "../../../cart/models/uuid";
import { RequestPosition } from "../models/request-position";
import { FormDataService } from "../../../shared/services/form-data.service";
import { History } from "../models/history";
import { saveAs } from 'file-saver/src/FileSaver';
import { RequestGroup } from "../models/request-group";
import { GroupWithPositions } from "../models/groupWithPositions";

@Injectable()
export class RequestPositionService {

  constructor(private api: HttpClient, private formDataService: FormDataService) {}

  addPosition(requestId: Uuid, positions: Array<any>):  Observable<Array<RequestPosition>> {
    const url = `requests/${requestId}/add-positions/manual`;
    return this.api.post<RequestPosition[]>(url, this.formDataService.toFormData({positions}));
  }

  updatePosition(positionId: Uuid, body: Partial<RequestPosition>) {
    const url = `requests/positions/${positionId}/edit`;
    return this.api.post<RequestPosition>(url, body);
  }

  deleteRequestPositionDraft(draftId: Uuid) {
    const url = `requests/position-drafts/${draftId}/delete`;
    return this.api.post<RequestPosition>(url, {});
  }

  getHistory(requestPosition: RequestPosition) {
    const url = `requests/positions/${requestPosition.id}/history`;
    return this.api.get<History[]>(url);
  }

  downloadFileFromHistory(documentId: Uuid, documentName: string): void {
    const url = `requests/documents/${documentId}/download`;
    this.api.post(url, {}, {responseType: 'blob'}).subscribe(data => saveAs(data, documentName));
  }

  saveGroup(id: Uuid, name: string) {
    const url = `requests/${id}/add-group`;
    return this.api.post<RequestGroup>(url, { name });
  }

  addPositionsInGroup(id: Uuid, groupId: Uuid, positions: Uuid[]) {
    const url = `requests/${id}/groups/add-positions`;
    return this.api.post<GroupWithPositions>(url, { groupId, positions });
  }

  removePositionsFromGroup(requestId: Uuid, groupId: Uuid, positions: Uuid[]) {
    const url = `requests/${requestId}/groups/remove-positions`;
    return this.api.post<GroupWithPositions>(url, { groupId, positions });
  }
}
