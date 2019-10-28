import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { RequestPosition } from "../../common/models/request-position";
import { DesignDocumentation } from "../../common/models/design-documentation";
import { RequestDocument } from "../../common/models/request-document";
import { Observable, of } from "rxjs";
import { DesignDocumentationList } from "../../common/models/design-documentationList";
import { delay, map } from "rxjs/operators";

@Injectable()
export class DesignDocumentationService {

  constructor(
    protected api: HttpClient,
  ) {
  }

  getDesignDocumentationList(requestId: Uuid) {
    const url = `requests/${requestId}/designs`;
    return this.api.get<DesignDocumentationList[]>(url);
  }

  getPositionList(requestId: Uuid) {
    const url = `requests/${requestId}/designs/positions`;
    return this.api.get<RequestPosition[]>(url);
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

  edit(id: Uuid, designDoc: DesignDocumentationList): Observable<DesignDocumentationList> {
    const url = `requests/${id}/designs/edit`;

    return of(designDoc).pipe(
      this.simulateDelay(),
      map(designDocList => {
        designDocList.designDocs = designDocList.designDocs.map(_designDoc => {
          _designDoc.id = Date.now() as any as string;
          return _designDoc;
        });
        return designDocList;
      })
    );

  }

  uploadDocuments(id: Uuid, designDocId: Uuid, files: File[]): Observable<RequestDocument[]> {
    const url = `requests/${id}/designs/docs/${designDocId}/upload`;
    const formData = new FormData();
    files.forEach(file => formData.append('files[]', file, file.name));

    return this.api.post<RequestDocument[]>(url, formData);
  }

  sendForApproval(id: Uuid, designDocId: Uuid): Observable<DesignDocumentationList> {
    const url = `requests/${id}/designs/${designDocId}/send-for-approval`;

    return this.api.post<DesignDocumentationList>(url, null);
  }

  approve(id: Uuid, designDocId: Uuid): Observable<DesignDocumentationList> {
    const url = `requests/${id}/designs/${designDocId}/approve`;

    return this.api.post<DesignDocumentationList>(url, null);
  }

  reject(id: Uuid, designDocId: Uuid, file: File): Observable<DesignDocumentationList> {
    const url = `requests/${id}/designs/${designDocId}/reject`;
    const formData = new FormData();
    formData.append('remarksFile', file, file.name);

    return this.api.post<DesignDocumentationList>(url, formData);
  }

  // TODO: Remove after implement REST
  private simulateDelay<T>(min = 400, max = 1400) {
    return delay<T>(Math.floor(Math.random() * (max - min + 1) + min));
  }
}
