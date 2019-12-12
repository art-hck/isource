import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestPositionList } from "../../../common/models/request-position-list";
import { RequestService } from "../../services/request.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  templateUrl: './request.component.html'
})
export class RequestComponent implements OnInit {

  request$: Observable<Request>;
  positions$: Observable<RequestPositionList[]>;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService
  ) { }

  ngOnInit() {
    const requestId = this.route.snapshot.paramMap.get('id');

    this.request$ = this.requestService.getRequestInfo(requestId);
    this.getPositions();
  }

  getPositions() {
    const requestId = this.route.snapshot.paramMap.get('id');

    this.positions$ = this.requestService.getRequestPositions(requestId);
  }

}
