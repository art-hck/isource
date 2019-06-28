import {Injectable} from "@angular/core";
import {ClrDatagridStringFilterInterface} from "@clr/angular";
import {RequestsList} from "../../models/requests-list/requests-list";


@Injectable()
export class RequestStatusFilter implements ClrDatagridStringFilterInterface<RequestsList> {
  accepts(request: RequestsList, search: string): boolean {
    if (search.length === 0) {
      return true;
    }
    if (!request.positions || request.positions.length === 0) {
      return false;
    }
    const requestItem = request.request;
    return (
      requestItem.status.label === search ||
      requestItem.status.label.toLowerCase().indexOf(search.toLowerCase()) >= 0
    );
  }
}
