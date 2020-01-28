import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Okei } from '../models/okei';

export class OkeiService {

  constructor(protected api: HttpClient) {}

  getOkeiList(): Observable<Okei[]> {
    return this.api.get<Okei[]>(`okei`, {});
  }

}
