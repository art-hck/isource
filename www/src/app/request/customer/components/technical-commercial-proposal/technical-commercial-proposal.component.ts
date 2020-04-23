import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { Actions, Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { TechnicalCommercialProposalByPosition } from "../../../common/models/technical-commercial-proposal-by-position";
import { getCurrencySymbol } from "@angular/common";
import { Subject } from "rxjs";
import { ClrModal } from "@clr/angular";
import { FormControl, Validators } from "@angular/forms";
import { finalize, takeUntil, tap } from "rxjs/operators";
import { TechnicalCommercialProposalHelperService } from "../../../common/services/technical-commercial-proposal-helper.service";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { RequestPosition } from "../../../common/models/request-position";
import { TechnicalCommercialProposalPosition } from "../../../common/models/technical-commercial-proposal-position";
import Approve = TechnicalCommercialProposals.Approve;
import Reject = TechnicalCommercialProposals.Reject;


@Component({
  selector: "app-request-technical-commercial-proposal",
  templateUrl: './technical-commercial-proposal.component.html',
  styleUrls: ['technical-commercial-proposal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalComponent implements OnInit, OnDestroy {
  @ViewChild("proposalModal") proposalModal: ClrModal;
  @ViewChildren('gridRow') gridRows: QueryList<ElementRef>;
  @Input() proposalByPos: TechnicalCommercialProposalByPosition;
  @Input() proposals: TechnicalCommercialProposal[];
  @Input() requestId: Uuid;
  @Input() chooseBy$: Subject<"date" | "price">;
  @Input() view: "list" | "grid";
  readonly destroy$ = new Subject();

  getCurrencySymbol = getCurrencySymbol;
  selectedProposalPosition = new FormControl(null, Validators.required);
  folded = false;

  get isReviewed(): boolean {
    return this.proposalByPos.data.some(({ proposalPosition }) => !["NEW", "SENT_TO_REVIEW"].includes(proposalPosition.status));
  }

  constructor(
    public helper: TechnicalCommercialProposalHelperService,
    private store: Store,
    private actions: Actions,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.chooseBy$) {
      this.chooseBy$.pipe(
        tap(type => this.selectedProposalPosition.setValue(this.helper.chooseBy(type, this.proposalByPos.data))),
        takeUntil(this.destroy$))
      .subscribe(() => this.cd.detectChanges());
    }

    // Workaround sync with multiple elements per one formControl
    this.selectedProposalPosition.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => this.selectedProposalPosition.setValue(v, {onlySelf: true, emitEvent: false}));
  }

  approve() {
    this.dispatchAction(new Approve(this.requestId, this.selectedProposalPosition.value));
  }

  reject() {
    this.dispatchAction(new Reject(this.requestId, this.proposalByPos.position));
  }

  private dispatchAction(action) {
    this.selectedProposalPosition.disable();
    this.store.dispatch(action).pipe(
      finalize(() => this.selectedProposalPosition.enable()),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  getProposalPosition({positions}: TechnicalCommercialProposal, {id}: RequestPosition): TechnicalCommercialProposalPosition {
    return positions.find(({position}) => position.id === id);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByproposalPositionId = (i, {proposalPosition}: TechnicalCommercialProposalByPosition["data"][number]) => proposalPosition.id;
}
