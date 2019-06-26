import {Component, OnInit} from '@angular/core';
import {Uuid} from "../../../../cart/models/uuid";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {BackofficeRequest} from "../../models/backoffice-request";
import {RequestPosition} from "../../models/request-position";
import {Request} from "../../../common/models/request";
import {RequestPosition} from "../../../common/models/request-position";

@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  styleUrls: ['./request-view.component.css']
})
export class RequestViewComponent implements OnInit {

  requestId: Uuid;
  request: Request;
  requestPositions: RequestPosition[];

  expanded = false;


  constructor(private route: ActivatedRoute, private requestService: RequestService) {
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');
    this.requestService.getRequestInfo(this.requestId).subscribe(
      (request: BackofficeRequest) => {
        this.request = request;
      }
    );
    this.requestService.getRequestPositions(this.requestId).subscribe(
      (requestPositions: RequestPosition[]) => {
        this.requestPositions = requestPositions;
      }
    );
  }

  onExpanded(): void {
    this.expanded = !this.expanded;
  }
}
