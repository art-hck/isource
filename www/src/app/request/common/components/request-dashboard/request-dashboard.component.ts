import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Request } from "../../models/request";
import { UserInfoService } from "../../../../core/services/user-info.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-request-dashboard',
  templateUrl: './request-dashboard.component.html',
  styleUrls: ['./request-dashboard.component.scss']
})
export class RequestDashboardComponent implements OnChanges {

  @Output() draftClick = new EventEmitter<void>();

  @Input() request: Request;
  @Input() filteredByDraftStatus = false;

  @Input() draftPositionsCount: number;
  tpOnAgreementCount: number;
  kpOnAgreementCount: number;
  rkdOnAgreementCount: number;
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
    this.rkdOnAgreementCount =  this.request.dashboard.rkd || 0;
    this.onAgreementReviewCount = this.request.dashboard.contractAgreement || 0;

    this.newMessagesCount = 3;
    this.newActivitiesCount = 6;
    this.requestDocumentsCount = this.request.documents.length || 0;
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


  openAddOffersPage() {
    if (this.user.isCustomer()) {
      this.router.navigateByUrl(`/requests/customer/${this.request.id}/commercial-proposals`).then(r => {});
    } else if (this.user.isBackOffice()) {
      this.router.navigateByUrl(`/requests/backoffice/${this.request.id}/add-offers`).then(r => {});
    } else {
      return false;
    }
  }


  openAddTechnicalProposalsPage() {
    if (this.user.isCustomer()) {
      this.router.navigateByUrl(`/requests/customer/${this.request.id}/technical-proposals`).then(r => {});
      return false;
    } else if (this.user.isBackOffice()) {
      this.router.navigateByUrl(`/requests/backoffice/${this.request.id}/add-technical-proposals`).then(r => {});
    } else {
      return false;
    }
  }

  openAddDesignDocumentationPage() {
    if (this.user.isCustomer()) {
      this.router.navigateByUrl(`/requests/customer/${this.request.id}/design-documentation`).then(r => {});
      return false;
    } else if (this.user.isBackOffice()) {
      this.router.navigateByUrl(`/requests/backoffice/${this.request.id}/add-design-documentation`).then(r => {});
    } else {
      return false;
    }
  }

  openContractsPage() {
    if (this.user.isCustomer()) {
      this.router.navigateByUrl(`/requests/customer/${this.request.id}/contracts`).then(r => {});
      return false;
    } else if (this.user.isBackOffice()) {
      this.router.navigateByUrl(`/requests/backoffice/${this.request.id}/contracts`).then(r => {});
    } else {
      return false;
    }
  }
}
