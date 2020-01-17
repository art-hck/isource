import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Request } from "../../../common/models/request";

@Component({templateUrl: './request-commercial-proposals.component.html'})
export class RequestCommercialProposalsComponent implements OnInit {

  request$: Observable<Request>;

  constructor() { }

  ngOnInit() {
  }

}
