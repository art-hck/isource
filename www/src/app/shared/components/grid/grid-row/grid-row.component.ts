import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Subject } from "rxjs";
import { FormControl, Validators } from "@angular/forms";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { takeUntil, tap } from "rxjs/operators";
import { Proposal } from "../proposal";
import { ProposalHelperService } from "../proposal-helper.service";
import { Position } from "../position";
import { GridSupplier } from "../grid-supplier";

@Component({
  selector: 'app-grid-row',
  templateUrl: './grid-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridRowComponent implements OnInit, OnDestroy {
  @ViewChildren('gridRow') gridRows: QueryList<ElementRef>;
  @Input() suppliers: GridSupplier[];
  @Input() proposals: Proposal[];
  @Input() position: Position;
  @Input() chooseBy$: Subject<"date" | "price">;
  @Input() isReviewed: boolean;
  @Input() getProposal: (supplier: ContragentShortInfo) => Proposal;
  @Input() getSupplier: (proposal: Proposal) => ContragentShortInfo;
  @Input() editable: boolean;
  @Input() simpleView: boolean;
  @Output() show = new EventEmitter<Proposal>();
  @Output() edit = new EventEmitter<Proposal>();
  @Output() create = new EventEmitter<ContragentShortInfo>();
  @HostBinding('class.position-row') positionRow = true;
  readonly selectedProposal = new FormControl(null, Validators.required);
  readonly sendToEditProposal = new FormControl(null, Validators.required);
  readonly rejectedProposal = new FormControl(null, Validators.required);
  readonly destroy$ = new Subject();

  constructor(private helper: ProposalHelperService) {}

  ngOnInit() {
    if (this.chooseBy$) {
      this.chooseBy$.pipe(
        tap(() => this.selectedProposal.reset()),
        tap(type => this.selectedProposal.setValue(
          this.helper.chooseBy(type, this.position, this.proposals)
        )),
        takeUntil(this.destroy$)
      ).subscribe();
    }

    this.selectedProposal.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(v => {
        // Workaround sync with multiple elements per one formControl
        this.selectedProposal.setValue(v, {onlySelf: true, emitEvent: false});
        this.sendToEditProposal.reset(null, {emitEvent: false});
        this.rejectedProposal.reset(null, {emitEvent: false});
      });

    this.rejectedProposal.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.selectedProposal.reset(null, {emitEvent: false});
        this.sendToEditProposal.reset(null, {emitEvent: false});
      });

    this.sendToEditProposal.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.selectedProposal.reset(null, {emitEvent: false});
        this.rejectedProposal.reset(null, {emitEvent: false});
      });
  }

  trackByProposalPositionId = (i, supplier: ContragentShortInfo) => this.getProposal(supplier)?.sourceProposal?.id;
  trackBySupplierId = (i, proposal: Proposal) => this.getSupplier(proposal)?.id;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
