import {Injectable} from "@angular/core";
import {ClrDatagridStringFilterInterface} from "@clr/angular";
import {RequestsList} from "../../models/requests-list/requests-list";


@Injectable()
export class CustomerNameFilter implements ClrDatagridStringFilterInterface<RequestsList> {
  accepts(request: RequestsList, search: string): boolean {
    if (search.length === 0) {
      return true;
    }
  }
}
