import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";
import {RequestPosition} from "../../common/models/request-position";
import {DesignDocumentation} from "../../common/models/design-documentation";
import {RequestDocument} from "../../common/models/request-document";
import {Observable} from "rxjs";
import {DesignDocumentationList} from "../../common/models/design-documentationList";

@Injectable()
export class DesignDocumentationService {

  constructor(
    protected api: HttpClient,
  ) {
  }

  getDesignDocumentationList(requestId: Uuid) {
    const url = `requests/${requestId}/designs`;
    return this.api.get(url);
  }

  getPositionList(requestId: Uuid) {
    const url = `requests/${requestId}/designs/positions`;
    return this.api.get(url);
  }

  addDesignDocumentationList(id: Uuid, designDocs: DesignDocumentation[], positions: RequestPosition[]) {
    const url = `requests/${id}/designs/create`;
    const ids = [];
    for (const position of positions) {
      ids.push(position.id);
    }
    return this.api.post(url, {
      positions: ids,
      designDocs: designDocs
    });
  }

  uploadDocuments(id: Uuid, designDocId: Uuid, files: File[]): Observable<RequestDocument[]> {
    const url = `requests/${id}/designs/docs/${designDocId}/upload`;
    const formData = new FormData();
    files.forEach(file => formData.append('files[]', file, file.name));

    return this.api.post<RequestDocument[]>(url, formData);
  }

  sendForApproval(id: Uuid, designDocId: Uuid): Observable<DesignDocumentationList> {
    const url = `requests/${id}/designs/${designDocId}/on-approval`;

    return this.api.post<DesignDocumentationList>(url, null);
  }
}
