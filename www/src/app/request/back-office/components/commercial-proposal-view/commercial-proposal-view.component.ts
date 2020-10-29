import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Actions, Select, Store } from "@ngxs/store";
import { RequestState } from "../../states/request.state";
import { StateStatus } from "../../../common/models/state-status";
import { Uuid } from "../../../../cart/models/uuid";
import { ProposalsView } from "../../../../shared/models/proposals-view";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ProcedureSource } from "../../enum/procedure-source";
import { getCurrencySymbol } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { UxgBreadcrumbsService, UxgPopoverComponent } from "uxg";
import { RequestService } from "../../services/request.service";
import { FeatureService } from "../../../../core/services/feature.service";
import { AppComponent } from "../../../../app.component";
import { animate, style, transition, trigger } from "@angular/animations";
import { filter, finalize, startWith, switchMap, takeUntil, tap } from "rxjs/operators";
import { RequestActions } from "../../actions/request.actions";
import { Request } from "../../../common/models/request";
import { CommercialProposalsActions } from "../../actions/commercial-proposal.actions";
import { ProcedureAction } from "../../models/procedure-action";
import { Procedure } from "../../models/procedure";
import { RequestOfferPosition } from "../../../common/models/request-offer-position";
import { CommercialProposalState } from "../../states/commercial-proposal.state";
import { RequestPosition } from "../../../common/models/request-position";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { Proposal } from "../../../../shared/components/grid/proposal";
import { GridRowComponent } from "../../../../shared/components/grid/grid-row/grid-row.component";
import { ProposalHelperService } from "../../../../shared/components/grid/proposal-helper.service";
import { PositionStatus } from "../../../common/enum/position-status";
import { CommercialProposal } from "../../models/commercial-proposal";
import moment from "moment";
import { CommercialProposalsStatus } from "../../../common/enum/commercial-proposals-status";
import { GridSupplier } from "../../../../shared/components/grid/grid-supplier";
import { CommercialProposalsService } from "../../services/commercial-proposals.service";
import DownloadAnalyticalReport = CommercialProposalsActions.DownloadAnalyticalReport;
import Fetch = CommercialProposalsActions.Fetch;
import DownloadTemplate = CommercialProposalsActions.DownloadTemplate;
import UploadTemplate = CommercialProposalsActions.UploadTemplate;
import Refresh = CommercialProposalsActions.Refresh;
import PublishPositions = CommercialProposalsActions.PublishPositions;
import AddSupplier = CommercialProposalsActions.AddSupplier;
import Rollback = CommercialProposalsActions.Rollback;
import { SupplierCommercialProposalInfo } from "../../models/supplier-commercial-proposal-info";

@Component({
  templateUrl: './commercial-proposal-view.component.html',
  animations: [trigger('sidebarHide', [
    transition(':leave', animate('300ms ease', style({ 'max-width': '0', 'margin-left': '0' }))),
  ])],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommercialProposalViewComponent implements OnInit, AfterViewInit {
  @ViewChild('viewPopover') viewPopover: UxgPopoverComponent;
  @ViewChildren(GridRowComponent) gridRowsComponent: QueryList<GridRowComponent>;
  @Select(CommercialProposalState.commercialProposals) commercialProposals$: Observable<{ suppliers: SupplierCommercialProposalInfo[], positions: RequestPosition[] }>;
  @Select(CommercialProposalState.positions) positions$: Observable<RequestPosition[]>;
  @Select(CommercialProposalState.suppliers) suppliers$: Observable<SupplierCommercialProposalInfo[]>;
  @Select(CommercialProposalState.procedures) procedures$: Observable<Procedure[]>;
  @Select(CommercialProposalState.status) status$: Observable<StateStatus>;
  @Select(RequestState.status) requestStatus$: Observable<StateStatus>;
  @Select(RequestState.request) request$: Observable<Request>;
  contragentsWithTp$: Observable<ContragentShortInfo[]>;
  requestId: Uuid;
  readonly destroy$ = new Subject();
  view: ProposalsView = "grid";
  form: FormGroup;
  loadingContragentList: boolean;
  files: File[] = [];
  gridRows: ElementRef[];
  proposalsGroupedBySuppliers: CommercialProposal[];
  proposalModalData: {position: RequestPosition, proposal: Proposal};
  procedureModalPayload: ProcedureAction & { procedure?: Procedure };
  addProposalPositionPayload: {position: RequestPosition, supplier?: ContragentShortInfo, proposal?: Proposal};
  prolongModalPayload: Procedure;
  rollbackDuration = 10 * 60;

  readonly getCurrencySymbol = getCurrencySymbol;
  readonly procedureSource = ProcedureSource.COMMERCIAL_PROPOSAL;
  readonly downloadAnalyticalReport = () => new DownloadAnalyticalReport(this.requestId);
  readonly downloadTemplate = (request: Request) => new DownloadTemplate(request);
  readonly uploadTemplate = (files: File[]) => new UploadTemplate(this.requestId, files);
  readonly refresh = () => new Refresh(this.requestId);
  readonly publishPositions = () => new PublishPositions(this.requestId, this.selectedPositions);
  readonly addSupplier = ({ id }: ContragentShortInfo) => new AddSupplier(this.requestId, id);
  readonly rollback = ({ id }: RequestPosition) => new Rollback(this.requestId, id);

  get selectedPositions() {
    return (this.form?.get('positions') as FormArray)?.controls?.filter(({value}) => value.checked).map(({value}) => value.position);
  }

  addContragentDisabled(positions: RequestPosition[]) {
    return positions.every(({status}) => status === 'WINNER_SELECTED');
  }

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private requestService: RequestService,
    private actions: Actions,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private app: AppComponent,
    public featureService: FeatureService,
    public store: Store,
    public router: Router,
    public helper: ProposalHelperService,
    private commercialProposalsService: CommercialProposalsService,
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
        { label: 'Согласование коммерческих предложений', link: `/requests/backoffice/${this.requestId}/commercial-proposals` }
      ]),
      takeUntil(this.destroy$)
    ).subscribe();

    this.positions$.pipe(filter(p => !!p), takeUntil(this.destroy$)).subscribe((positions) => {
      this.form = this.fb.group({
        checked: false,
        positions: this.fb.array(positions.map(position => {
          const form = this.fb.group({ checked: false, position });
          if (position.status !== 'PROPOSALS_PREPARATION' || position.linkedOffers.length === 0) {
            form.get("checked").disable();
          }
          return form;
        }))
      });
    });

    this.commercialProposals$.pipe(filter(p => !!p.suppliers || !!p.positions), takeUntil(this.destroy$)).subscribe((data) => {
      this.getProposalsGroupedBySuppliers(data.suppliers, data.positions);
    });

    this.switchView(this.view);
  }

  ngAfterViewInit() {
    this.gridRowsComponent.changes.pipe(
      startWith(this.gridRowsComponent),
      tap(() => this.gridRows = this.gridRowsComponent.reduce((gridRows, c) => [...gridRows, ...c.gridRows], [])),
      tap(() => this.cd.detectChanges()),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  switchView(view: ProposalsView) {
    this.view = view;
    this.app.noContentPadding = view !== "list";
    this.viewPopover?.hide();
  }

  hasAnalogs(positions: RequestPosition[]) {
    return i => positions[i]?.linkedOffers.some(p => p?.isAnalog);
  }

  isOnEdit({ linkedOffers }: RequestPosition) {
    return linkedOffers.length && linkedOffers.every(({status}) => status === CommercialProposalsStatus.SENT_TO_EDIT);
  }

  convertProposals(proposals: RequestOfferPosition[]) {
    return proposals.map(proposal => new Proposal<RequestOfferPosition>(proposal));
  }

  convertSuppliers(suppliers: ContragentShortInfo[], positions: RequestPosition[]): GridSupplier[] {
    return suppliers.reduce((arr: GridSupplier[], supplier) => {
      const proposals = positions
        .map(({ linkedOffers }) => linkedOffers.filter(({ supplierContragentId }) => supplierContragentId === supplier.id))
        .reduce((acc, curr) => [...acc, ...curr], []);

      // Берём позицию и смотрим есть ли оффер с таким поставщиком и совпадает ли флаг аналогов, ИЛИ если офферов 0 И НЕ аналог
      [false, true]
        .filter(hasAnalogs => proposals.some(({ isAnalog }) => isAnalog === hasAnalogs) || proposals.length === 0 && !hasAnalogs)
        .forEach(hasAnalogs => arr.push({ ...supplier, hasAnalogs }));
      return arr;
    }, []);
  }

  canRollback(position: RequestPosition): boolean {
    return position.status === PositionStatus.RESULTS_AGREEMENT &&
      moment().diff(moment(position.statusChangedDate), 'seconds') < this.rollbackDuration;
  }

  getProposalBySupplier = (position: RequestPosition) => ({ id, hasAnalogs }: GridSupplier) => {
    const proposal = position.linkedOffers.find(({ supplierContragentId, isAnalog }) => supplierContragentId === id && isAnalog === hasAnalogs);
    return proposal ? new Proposal<RequestOfferPosition>(proposal) : null;
  }

  getProposalsGroupedBySuppliers(suppliers: SupplierCommercialProposalInfo[], positions: RequestPosition[]) {
    this.proposalsGroupedBySuppliers = suppliers.map(supplier => {
        const items = positions
          .map(position => {
            return {
              position: position,
              linkedOffer: position.linkedOffers.find(({ supplierContragentId }) => supplierContragentId === supplier.id)
            };
          }).reduce((acc, curr) => curr.linkedOffer ? [...acc, { ...curr }] : acc, []);

        return { supplier, items };
    });
  }

  onPositionsSelected(positionsIds) {
    this.loadingContragentList = true;
    this.contragentsWithTp$ = this.commercialProposalsService
      .getContragentsWithTp(this.requestId, positionsIds).pipe(
        finalize(() => this.loadingContragentList = false)
      );
  }

  getProposalSupplier = (proposal: Proposal<RequestOfferPosition>) => proposal.sourceProposal.supplierContragent;

  trackById = (i, { id }) => id;
}
