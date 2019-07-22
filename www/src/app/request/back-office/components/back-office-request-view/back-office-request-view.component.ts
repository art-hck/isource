import {Component, OnInit, ViewChild} from '@angular/core';
import {Request} from "../../../common/models/request";
import {RequestPosition} from "../../../common/models/request-position";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {Uuid} from "../../../../cart/models/uuid";
import { RequestViewComponent } from 'src/app/request/common/components/request-view/request-view.component';
import { LinkedOffersSortService } from 'src/app/request/common/services/linked-offers-sort-service';

@Component({
  selector: 'app-back-office-request-view',
  templateUrl: './back-office-request-view.component.html',
  styleUrls: ['./back-office-request-view.component.css']
})
export class BackOfficeRequestViewComponent implements OnInit {
  requestId: Uuid;
  request: Request;
  requestPositions: RequestPosition[];

  protected linkedOffersSorter = new LinkedOffersSortService();

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
    this.updatePositionsList();
  }

  updatePositionsList(callback?: (positions: RequestPosition[]) => void): void {
    this.requestService.getRequestPositions(this.requestId).subscribe(
      (requestPositions: RequestPosition[]) => {
        this.linkedOffersSorter.sort(requestPositions);
        this.requestPositions = requestPositions;
        this.requestView.requestPositions = requestPositions;
        if (callback) {
          callback(requestPositions);
        }
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

  onCreatedNewPosition(positionId: Uuid): void {
    this.updatePositionsList(() => {
      this.requestView.selectPosition(positionId);
    });
  }
}
