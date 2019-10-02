import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";

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
}
