import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { TechnicalCommercialProposalGroup } from "../../../common/models/technical-commercial-proposal-group";
import { delayWhen, scan, switchMap, takeUntil, tap, throttleTime, withLatestFrom } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { TechnicalCommercialProposalService } from "../../services/technical-commercial-proposal.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestState } from "../../states/request.state";
import { RequestActions } from "../../actions/request.actions";
import { UxgBreadcrumbsService, UxgModalComponent } from "uxg";
import { Actions, ofActionCompleted, Select, Store } from "@ngxs/store";
import { Request } from "../../../common/models/request";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import DownloadTemplate = TechnicalCommercialProposals.DownloadTemplate;
import UploadTemplate = TechnicalCommercialProposals.UploadTemplate;
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { ProcedureAction } from "../../models/procedure-action";
import { Procedure } from "../../models/procedure";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { RequestPosition } from "../../../common/models/request-position";
import { FeatureService } from "../../../../core/services/feature.service";
import { ProcedureSource } from "../../enum/procedure-source";
import RefreshProcedures = TechnicalCommercialProposals.RefreshProcedures;
import FetchAvailablePositions = TechnicalCommercialProposals.FetchAvailablePositions;
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import FetchProcedures = TechnicalCommercialProposals.FetchProcedures;

@Component({
  selector: 'app-technical-commercial-proposal-group-view',
  templateUrl: './technical-commercial-proposal-group-view.component.html',
  styleUrls: ['technical-commercial-proposal-group-view.component.scss'],
})
export class TechnicalCommercialProposalGroupViewComponent implements OnInit {
  @ViewChild('uploadTemplateModal') uploadTemplateModal: UxgModalComponent;
  @Select(RequestState.request) request$: Observable<Request>;
  @Select(TechnicalCommercialProposalState.availablePositions) availablePositions$: Observable<RequestPosition[]>;
  @Select(TechnicalCommercialProposalState.procedures) procedures$: Observable<Procedure[]>;
  form: FormGroup;
  requestId: Uuid;
  procedureModalPayload: ProcedureAction & { procedure?: Procedure };
  editedGroup: TechnicalCommercialProposalGroup;
  invalidUploadTemplate = false;
  files: File[] = [];
  destroy$ = new Subject();

  readonly procedureSource = ProcedureSource.TECHNICAL_COMMERCIAL_PROPOSAL;
  readonly newGroup$ = new BehaviorSubject<TechnicalCommercialProposalGroup>(null);
  readonly tcpGroups$: Observable<TechnicalCommercialProposalGroup[]> = this.route.params.pipe(
    tap(({ id }) => this.requestId = id),
    delayWhen(({ id }) => this.store.dispatch([new RequestActions.Fetch(id), new FetchAvailablePositions(id), new FetchProcedures(id)])),
    withLatestFrom(this.request$),
    tap(([p, { id, number }]) => this.bc.breadcrumbs = [
      { label: "Заявки", link: "/requests/backoffice" },
      { label: `Заявка №${number}`, link: `/requests/backoffice/${id}` },
      { label: 'Согласование ТКП', link: `/requests/backoffice/${this.requestId}/technical-commercial-proposals`},
    ]),
    switchMap(() => this.service.groupList(this.requestId)),
    switchMap(groups => this.newGroup$.pipe(scan((acc, group) => {
      if (group) {
        const i = acc.findIndex(({id}) => group?.id === id);
        i !== -1 ? acc[i] = group : acc.push(group);
      }

      return acc;
    }, groups))),
  );

  readonly updateProcedures = () => [new RefreshProcedures(this.requestId), new FetchAvailablePositions(this.requestId)];
  readonly downloadTemplate = (requestId: Uuid) => new DownloadTemplate(requestId);
  readonly uploadTemplate = (requestId: Uuid, groupId: Uuid, files: File[], groupName: string) => new UploadTemplate(requestId, groupId, files, groupName);

  constructor(
    private bc: UxgBreadcrumbsService,
    private route: ActivatedRoute,
    private actions: Actions,
    public featureService: FeatureService,
    public store: Store,
    public service: TechnicalCommercialProposalService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      technicalCommercialProposalGroupName: [null, [Validators.required]],
    });

    this.actions.pipe(
      ofActionCompleted(UploadTemplate),
      throttleTime(1),
      takeUntil(this.destroy$)
    ).subscribe(({result}) => {
      const e = result.error as any;
      this.store.dispatch(e ?
        new ToastActions.Error(e && e.error.detail) :
        new ToastActions.Success(`Группа ТКП успешно сохранена`));
      if (!e) { this.service.groupList(this.requestId); }
    });
  }

  onChangeFilesList(files: File[]): void {
    this.files = files;
    if (this.files.length !== 0) {
      this.invalidUploadTemplate = false;
    }
  }

  submit() {
    if (this.files.length === 0) {
      this.invalidUploadTemplate = true;
    }

    if (this.form.valid && !this.invalidUploadTemplate) {
      this.uploadTemplateModal.close();
      this.store.dispatch(this.uploadTemplate(this.requestId, null, this.files, this.form.get('technicalCommercialProposalGroupName').value));
    }
  }

  trackById = (i, { id }: TechnicalCommercialProposal | Procedure) => id;
}
