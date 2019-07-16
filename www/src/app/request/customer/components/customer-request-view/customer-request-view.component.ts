import {Component, OnInit} from '@angular/core';
import {Uuid} from "../../../../cart/models/uuid";
import {Request} from "../../../common/models/request";
import {RequestPosition} from "../../../common/models/request-position";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../services/request.service";


@Component({
  selector: 'app-customer-request-view',
  templateUrl: './customer-request-view.component.html',
  styleUrls: ['./customer-request-view.component.css']
})
export class CustomerRequestViewComponent implements OnInit {


  requestId: Uuid;
  request: Request;
  requestPositions: RequestPosition[];

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService
  ) {
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');
    this.requestService.getRequestInfo(this.requestId).subscribe(
      (request: Request) => {
        this.request = request;
      }
    );
    this.updateState();
  }


  updateState() {
    this.requestService.getRequestPositions(this.requestId).subscribe(
      (requestPositions: RequestPosition[]) => {
        this.requestPositions = requestPositions;
      }
    );
  }

  onUpdateRequestInfo() {
    this.requestService.getRequestInfo(this.requestId).subscribe(
      (request: Request) => {
        this.request = request;
      }
    );
  }
}
