import { ActivatedRoute, Router } from "@angular/router";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable, Subject, timer } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { filter, switchMap, takeUntil, tap, throttleTime } from "rxjs/operators";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "uxg";
import { FeatureService } from "../../../../core/services/feature.service";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { Actions, ofActionCompleted, Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { RequestPosition } from "../../../common/models/request-position";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { RequestState } from "../../states/request.state";
import { RequestActions } from "../../actions/request.actions";
import { FormArray, FormBuilder } from "@angular/forms";
import { animate, style, transition, trigger } from "@angular/animations";
import { TechnicalCommercialProposalGroupByPosition } from "../../../common/models/technical-commercial-proposal-group-by-position";
import { TechnicalCommercialProposalPosition } from "../../../common/models/technical-commercial-proposal-position";
import { getCurrencySymbol } from "@angular/common";
import * as moment from "moment";
import Create = TechnicalCommercialProposals.Create;
import Update = TechnicalCommercialProposals.Update;
import Publish = TechnicalCommercialProposals.Publish;
import Fetch = TechnicalCommercialProposals.Fetch;
import DownloadTemplate = TechnicalCommercialProposals.DownloadTemplate;
import UploadTemplate = TechnicalCommercialProposals.UploadTemplate;
import DownloadAnalyticalReport = TechnicalCommercialProposals.DownloadAnalyticalReport;

@Component({
  templateUrl: './technical-commercial-proposal-list.component.html',
  styleUrls: ['technical-commercial-proposal-list.component.scss'],
  animations: [trigger('sidebarHide', [
    transition(':leave', animate('300ms ease', style({ 'max-width': '0', 'margin-left': '0' }))),
  ])],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalListComponent implements OnInit, OnDestroy {
  @ViewChildren('gridRow') gridRows: QueryList<ElementRef>;
  @Select(TechnicalCommercialProposalState.proposals) proposals$: Observable<TechnicalCommercialProposal[]>;
  @Select(TechnicalCommercialProposalState.proposalsByPositions) proposalsByPositions$: Observable<TechnicalCommercialProposalGroupByPosition[]>;
  @Select(TechnicalCommercialProposalState.availablePositions) availablePositions$: Observable<RequestPosition[]>;
  @Select(TechnicalCommercialProposalState.proposalsLength) proposalsLength$: Observable<number>;
  @Select(RequestState.request) request$: Observable<Request>;
  readonly destroy$ = new Subject();
  requestId: Uuid;
  showForm: boolean;
  files: File[] = [];
  view: "grid" | "list" = "grid";
  readonly form = this.fb.group({ checked: false });
  readonly getCurrencySymbol = getCurrencySymbol;
  readonly downloadTemplate = (requestId: Uuid) => new DownloadTemplate(requestId);
  readonly uploadTemplate = (requestId: Uuid, files: File[]) => new UploadTemplate(requestId, files);
  readonly downloadAnalyticalReport = (requestId: Uuid) => new DownloadAnalyticalReport(requestId);

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private requestService: RequestService,
    private featureService: FeatureService,
    private actions: Actions,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    public store: Store,
    public router: Router,
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      tap(({id}) => this.requestId = id),
      tap(({id}) => this.store.dispatch(new Fetch(id))),
      switchMap(({id}) => this.store.dispatch(new RequestActions.Fetch(id))),
      switchMap(() => this.request$),
      filter(request => !!request),
      tap(({id, number}) => this.bc.breadcrumbs = [
        { label: "Заявки", link: "/requests/backoffice" },
        { label: `Заявка №${number}`, link: `/requests/backoffice/${id}` },
        { label: 'Согласование технико-коммерческих предложений', link: `/requests/backoffice/${this.requestId}/technical-commercial-proposals` }
      ]),
      takeUntil(this.destroy$)
    ).subscribe();

    this.proposalsByPositions$.pipe(filter(p => !!p), takeUntil(this.destroy$)).subscribe((items) => {
      this.form.removeControl("positions");
      this.form.addControl("positions", this.fb.array(
        items.map(item => {
          return this.fb.group({ checked: false, item });
        })
      ));
    });

    this.actions.pipe(
      ofActionCompleted(Create, Update, Publish, UploadTemplate),
      throttleTime(1),
      takeUntil(this.destroy$)
    ).subscribe(({action, result}) => {
      const e = result.error as any;
      this.store.dispatch(e ?
        new ToastActions.Error(e && e.error.detail) :
        new ToastActions.Success(`ТКП успешно ${action instanceof Publish ? 'отправлено' : 'сохранено'}`));
    });
  }

  getPositions(proposals: TechnicalCommercialProposal[]): RequestPosition[] {
    return proposals
      .map(proposal => proposal.positions.map(proposalPosition => proposalPosition.position))
      .reduce((prev, curr) => [...prev, ...curr], []);
  }

  getContragents(proposals: TechnicalCommercialProposal[]): ContragentShortInfo[] {
    return proposals
      .map(proposal => proposal.supplier);
  }

  getProposalPosition({positions}: TechnicalCommercialProposal, {id}: RequestPosition): TechnicalCommercialProposalPosition {
    return positions.find(({position}) => position.id === id);
  }

  isReviewed({data}: TechnicalCommercialProposalGroupByPosition): boolean {
    return data.some(({proposal: p}) => p.status === 'REVIEWED');
  }

  // downloadAnalyticalReport() {
  //   this.store.dispatch(new DownloadAnalyticalReport(this.requestId));
  // }

  trackByProposalId = (i, proposal: TechnicalCommercialProposal) => proposal.id;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:keydown.arrowLeft')
  scrollLeft() {
    this.gridRows.forEach(({nativeElement: el}) => el.scroll({ left: el.scrollLeft - 300, behavior: 'smooth' }));
    timer(350).subscribe(() => this.cd.detectChanges());
  }

  @HostListener('document:keydown.arrowRight')
  scrollRight() {
    this.gridRows.forEach(({nativeElement: el}) => el.scroll({ left: el.scrollLeft + 300, behavior: 'smooth' }));
    timer(350).subscribe(() => this.cd.detectChanges());
  }

  isDateValid(proposalPosition: TechnicalCommercialProposalPosition): boolean {
    return proposalPosition.position.isDeliveryDateAsap ||
      moment(proposalPosition.deliveryDate).isSameOrBefore(moment(proposalPosition.position.deliveryDate));
  }

  isQuantityValid(proposalPosition: TechnicalCommercialProposalPosition): boolean {
    return proposalPosition.quantity === proposalPosition.position.quantity;
  }

  get selectedPositions() {
    return (this.form.get('positions') as FormArray).controls
      .filter(({value}) => value.checked)
      .map(({value}) => value.item);
  }
}
