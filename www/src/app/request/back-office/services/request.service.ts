import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {map} from "rxjs/operators";
import {Uuid} from "../../../cart/models/uuid";
import {RequestPosition} from "../models/request-position";
import {Observable} from "rxjs";


@Injectable()
export class RequestService {

  constructor(
    protected api: HttpClient,
  ) {
  }
  getRequestInfo(id: Uuid) {
    const url = `requests/backoffice/${id}/info`;
    return this.api.post(url, {});
  }

  getRequestPositions(id: Uuid): Observable<RequestPosition[]> {
    const url = `requests/backoffice/${id}/positions`;
    return this.api.post<RequestPosition[]>(url, {}).pipe(
      map((data: RequestPosition[]) => {
        // todo временная заглушка пока нет данных с бэка
        data.forEach(position => {
          position.documents = [
            {
              id: '2342342342',
              user: {
                shortName: 'Воскресенская Н.И.'
              },
              created: '2019-11-11',
              filename: 'Техническая документация для изготовления пирожков.pdf'
            },
            {
              id: '2342342342',
              user: {
                shortName: 'Воскресенская Н.И.'
              },
              created: '2019-11-11',
              filename: 'Требования и стандарты изготовления пирожков.doc'
            }
          ];
        });

        return data;
      })
    );
  }
}

