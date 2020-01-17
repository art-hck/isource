import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Request } from "../../../common/models/request";
import { map } from "rxjs/operators";
import { RequestOfferPosition } from "../../../common/models/request-offer-position";

@Component({ templateUrl: './request-commercial-proposals.component.html' })
export class RequestCommercialProposalsComponent implements OnInit {

  request$: Observable<Request>;

  commercialProposals$: Observable<RequestOfferPosition[]>;
  showForm = true;

  constructor() { }

  ngOnInit() {
  }

  addCommercialProposal(commercialProposal) {
    this.commercialProposals$ = this.commercialProposals$.pipe(
      map(commercialProposals => [commercialProposal, ...commercialProposals])
    );
  }
}
