import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Request } from "../../models/request";

@Component({
  selector: 'app-request-dashboard',
  templateUrl: './request-dashboard.component.html',
  styleUrls: ['./request-dashboard.component.scss']
})
export class RequestDashboardComponent implements OnInit {

  @Input() request: Request;
  @Output() draftClick = new EventEmitter<void>();

  @Input() filteredByDraftStatus = false;
  requestDocumentsModalOpened = false;

  draftsOnAgreementCount: number;
  tpOnAgreementCount: number;
  kpOnAgreementCount: number;
  rkdOnAgreementCount: number;
  onAgreementReviewCount: number;

  newMessagesCount: number;
  newActivitiesCount: number;
  requestDocumentsCount: number;

  constructor() { }

  ngOnInit() {
    this.getRequestDashboardCounters();
  }


  onDraftClick() {
      this.draftClick.emit();
  }


  getRequestDashboardCounters() {
    this.draftsOnAgreementCount = 15;
    this.tpOnAgreementCount = this.request.dashboard.tp;
    this.kpOnAgreementCount = this.request.dashboard.kp;
    this.rkdOnAgreementCount = 61;
    this.onAgreementReviewCount = this.request.dashboard.contractAgreement;

    this.newMessagesCount = 13;
    this.newActivitiesCount = 41;
    this.requestDocumentsCount = this.request.documents.length;
  }


  /**
   * Функция возвращает
   *
   * @param count
   */
  getPositionsCountLabel(count: number): string {
    const cases = [2, 0, 1, 1, 1, 2];
    const strings = ['позиция', 'позиции', 'позиций'];

    const positionsString = strings[
      ( count % 100 > 4 && count % 100 < 20 ) ?
        2 :
        cases[
          (count % 10 < 5) ?
            count % 10 :
            5
          ]
      ];

    return positionsString;
  }

}
