import {Component, ComponentFactoryResolver, Inject, OnInit} from '@angular/core';
import {pluck, tap} from "rxjs/operators";
import {Request} from "../../../common/models/request";
import {UxgBreadcrumbsService} from "uxg";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {FormBuilder} from "@angular/forms";
import {OffersService} from "../../services/offers.service";
import {ContragentService} from "../../../../contragent/services/contragent.service";
import {DocumentsService} from "../../../common/services/documents.service";
import {ProcedureService} from "../../services/procedure.service";
import {NotificationService} from "../../../../shared/services/notification.service";
import {GpnmarketConfigInterface} from "../../../../core/config/gpnmarket-config.interface";
import {Uuid} from "../../../../cart/models/uuid";
import {RequestPosition} from "../../../common/models/request-position";
import {Observable} from "rxjs";
import {ContragentList} from "../../../../contragent/models/contragent-list";
import {APP_CONFIG} from '@stdlib-ng/core';

@Component({templateUrl: './request-commercial-proposals.component.html'})
export class RequestCommercialProposalsComponent implements OnInit {

  requestId: Uuid;
  request$: Observable<Request>;
  requestPositions: RequestPosition[] = [];
  requestPositions$: Observable<RequestPosition[]>;
  suppliers: ContragentList[] = [];

  appConfig: GpnmarketConfigInterface;

  constructor(private bc: UxgBreadcrumbsService,
              private route: ActivatedRoute,
              private requestService: RequestService,
              protected offersService: OffersService,
              protected router: Router,
              @Inject(APP_CONFIG) appConfig: GpnmarketConfigInterface
  ) {
    this.appConfig = appConfig;
    this.requestId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {

    this.request$ = this.requestService.getRequestInfo(this.requestId).pipe(
      tap(request => {
        this.bc.breadcrumbs = [
          {label: "Заявки", link: "/requests/backoffice"},
          {label: `Заявка №${request.number}`, link: `/requests/backoffice/${request.id}/new`},
          {
            label: 'Согласование технических предложений',
            link: `/requests/backoffice/${this.requestId}/new/technical-proposals`
          }
        ];
      })
    );
    this.updatePositionsAndSuppliers();
  }

  protected updatePositionsAndSuppliers(): void {
    const requestPositionsWithOffersData = this.requestService.getRequestPositionsWithOffers(this.requestId);
    this.requestPositions$ = requestPositionsWithOffersData.pipe(pluck('positions'));
    const subscription = requestPositionsWithOffersData.subscribe(
      (data: any) => {
        this.requestPositions = data.positions;
        this.suppliers = data.suppliers;
        subscription.unsubscribe();
      }
    );
  }

  sendForAgreement(requestId: Uuid, selectedRequestPositions: RequestPosition[]) {
    console.log(selectedRequestPositions);
    this.offersService.publishRequestOffers(requestId, selectedRequestPositions).subscribe(
      () => {
        this.updatePositionsAndSuppliers();
      });
  }
}
