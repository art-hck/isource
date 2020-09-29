import { Component } from '@angular/core';
import { Select } from "@ngxs/store";
import { RequestState } from "../../states/request.state";
import { Observable } from "rxjs";
import { Request } from "../../../common/models/request";

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent {
  @Select(RequestState.request) request$: Observable<Request>;
}
