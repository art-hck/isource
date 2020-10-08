import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { RequestPosition } from "../../../common/models/request-position";
import { UxgModalComponent } from "uxg";
import { iif, Observable, Subject, throwError } from "rxjs";
import { TechnicalCommercialProposalGroup } from "../../../common/models/technical-commercial-proposal-group";
import { catchError, finalize, map, takeUntil, tap } from "rxjs/operators";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RequestService } from "../../services/request.service";
import { TechnicalCommercialProposalService } from "../../services/technical-commercial-proposal.service";
import { Uuid } from "../../../../cart/models/uuid";
import { Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import FetchAvailablePositions = TechnicalCommercialProposals.FetchAvailablePositions;

@Component({
  selector: 'app-technical-commercial-proposal-group-form',
  templateUrl: './technical-commercial-proposal-group-form.component.html',
  styleUrls: ['./technical-commercial-proposal-group-form.component.scss']
})
export class TechnicalCommercialProposalGroupFormComponent implements OnInit, OnDestroy {
  @Select(TechnicalCommercialProposalState.availablePositions) availablePositions$: Observable<RequestPosition[]>;
  @ViewChild('createGroup') createGroup: UxgModalComponent;
  @Output() cancel = new EventEmitter();
  @Output() create = new EventEmitter<TechnicalCommercialProposalGroup>();
  @Input() requestId: Uuid;
  @Input() group: TechnicalCommercialProposalGroup;
  isLoading = false;
  readonly destroy$ = new Subject();
  readonly mergeWithExistPositions$ = this.availablePositions$.pipe(map(
    positions => (this.group?.requestPositions ?? [])
      .filter(groupPosition => positions?.every(({ id }) => groupPosition.id !== id))
      .reduce((arr, curr) => [curr, ...arr], positions)
  ));

  readonly form = this.fb.group({
    name: [null, Validators.required],
    requestPositions: [null, [Validators.minLength(1), Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private service: TechnicalCommercialProposalService,
    private store: Store
  ) {}

  ngOnInit() {
    this.form.patchValue(this.group ?? {});

    this.route.params.pipe(
      tap(({ id }) => this.store.dispatch(new FetchAvailablePositions(id))),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  mergeWithExistPositions(positions: RequestPosition[]) {
    return (this.group?.requestPositions ?? [])
      .filter(groupPosition => positions.every(({ id }) => groupPosition.id !== id))
      .reduce((arr, curr) => [curr, ...arr], positions);
  }

  submit() {
    if (this.form.invalid) { return; }

    this.isLoading = true;

    const body = {
      ...this.form.value,
      requestPositions: this.form.value.requestPositions.map(({ id }) => id)
    };

    iif(() => !this.group?.id,
      this.service.groupCreate(this.requestId, body),
      this.service.groupUpdate(this.requestId, this.group?.id, body)
    ).pipe(
      finalize(() => this.isLoading = false),
      takeUntil(this.destroy$),
      catchError(err => {
        this.store.dispatch(new ToastActions.Error(err?.error?.detail || "Ошибка при создании ТКП"));
        return throwError(err);
      }),
    ).subscribe(group => this.create.emit(group));
  }


  filterPositions = (q: string, position: RequestPosition): boolean => position.name.toLowerCase().indexOf(q.toLowerCase()) >= 0;
  trackById = (item: RequestPosition) => item.id;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
