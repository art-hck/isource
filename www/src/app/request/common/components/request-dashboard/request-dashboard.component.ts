import { Component, Input, OnInit } from '@angular/core';
import { Request } from "../../models/request";

@Component({
  selector: 'app-request-dashboard',
  templateUrl: './request-dashboard.component.html',
  styleUrls: ['./request-dashboard.component.scss']
})
export class RequestDashboardComponent implements OnInit {


  @Input() request: Request;

  filteredByDraftStatus = false;
  requestDocumentsModalOpened = false;

  draftAgreementCount: number;
  tpAgreementCount: number;
  kpAgreementCount: number;
  rkdAgreementCount: number;


  constructor() { }

  ngOnInit() {
    this.draftAgreementCount = 3;
    this.tpAgreementCount = 22;
    this.kpAgreementCount = 15;
    this.rkdAgreementCount = 61;
  }


  filterPositionsByDraft() {
    this.filteredByDraftStatus = true;
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
