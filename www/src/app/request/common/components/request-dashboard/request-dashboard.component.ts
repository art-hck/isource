import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Request } from "../../models/request";
import { UserInfoService } from "../../../../core/services/user-info.service";
import { Router } from "@angular/router";
import { RequestPosition } from "../../models/request-position";
import { RequestPositionList } from "../../models/request-position-list";

@Component({
  selector: 'app-request-dashboard',
  templateUrl: './request-dashboard.component.html',
  styleUrls: ['./request-dashboard.component.scss']
})
export class RequestDashboardComponent implements OnChanges {

  @Output() draftClick = new EventEmitter<void>();

  @Input() request: Request;
  @Input() requestPositions: RequestPositionList[] = [];
  @Input() filteredByDraftStatus = false;

  @Input() draftPositionsCount: number;
  tpOnAgreementCount: number;
  kpOnAgreementCount: number;
  rkdOnAgreementCount: number;
  rkdAvailable: boolean;
  onAgreementReviewCount: number;

  newMessagesCount: number;
  newActivitiesCount: number;
  requestDocumentsCount: number;

  requestDocumentsModalOpened = false;

  constructor(
    private router: Router,
    public user: UserInfoService
  ) { }

  ngOnChanges() {
    this.getRequestDashboardCounters();
  }

  onDraftClick() {
      this.draftClick.emit();
  }

  getRequestDashboardCounters() {
    this.tpOnAgreementCount = this.request.dashboard.tp || 0;
    this.kpOnAgreementCount = this.request.dashboard.kp || 0;
    this.rkdOnAgreementCount = this.request.dashboard.rkd || 0;
    this.rkdAvailable = this.getRkdAvailable() || false;
    this.onAgreementReviewCount = this.request.dashboard.contractAgreement || 0;

    this.newActivitiesCount = 0;
    this.requestDocumentsCount = this.request.documents.length || 0;
  }


  protected getRkdAvailable() {
    if (!this.requestPositions) {
      return false;
    }

    const positionWithIsDesignRequired = this.requestPositions.find(item => {
      if (item instanceof RequestPosition && item.isDesignRequired) {
        return true;
      }
    });

    return !!positionWithIsDesignRequired;
  }

  /**
   * Функция возвращает правильный лейбл для указанного количества позиций
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


  getOffersPageLink() {
    if (this.user.isCustomer()) {
      return '/requests/customer/' + this.request.id + '/commercial-proposals';
    } else if (this.user.isBackOffice()) {
      return '/requests/backoffice/' + this.request.id + '/add-offers';
    }

    return '';
  }

  getAddTechnicalProposalsLink() {
    if (this.user.isCustomer()) {
      return '/requests/customer/' + this.request.id + '/technical-proposals';
    } else if (this.user.isBackOffice()) {
      return '/requests/backoffice/' + this.request.id + '/add-technical-proposals';
    }

    return '';
  }

  getAddDesignDocumentationLink() {
    if (this.user.isCustomer()) {
      return '/requests/customer/' + this.request.id + '/design-documentation';
    } else if (this.user.isBackOffice()) {
      return '/requests/backoffice/' + this.request.id + '/add-design-documentation';
    }

    return '';
  }

  getContractsLink() {
    if (this.user.isCustomer()) {
      return '/requests/customer/' + this.request.id + '/contracts';
    } else if (this.user.isBackOffice()) {
      return '/requests/backoffice/' + this.request.id + '/contracts';
    }

    return '';
  }
}
