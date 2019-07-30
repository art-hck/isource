import {Component, OnInit, ViewChild} from '@angular/core';
import {Uuid} from "../../../../cart/models/uuid";
import {Request} from "../../../common/models/request";
import {RequestPosition} from "../../../common/models/request-position";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../services/request.service";
import { RequestViewComponent } from 'src/app/request/common/components/request-view/request-view.component';
import { Observable } from "rxjs";


@Component({
  selector: 'app-customer-request-view',
  templateUrl: './customer-request-view.component.html',
  styleUrls: ['./customer-request-view.component.css']
})
export class CustomerRequestViewComponent implements OnInit {

  updatedPosition: RequestPosition;
  requestId: Uuid;
  request: Request;
  requestPositions: RequestPosition[];

  @ViewChild(RequestViewComponent, {static: false})
  requestView: RequestViewComponent;

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
    this.updatePositionsList().subscribe((requestPositions) => {
      this.requestPositions = requestPositions;
    });
  }

  protected updatePositionsList(): Observable<RequestPosition[]> {
    return this.requestService.getRequestPositions(this.requestId);
  }
}
