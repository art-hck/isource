import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Subject } from "rxjs";
import { FormControl, Validators } from "@angular/forms";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { takeUntil, tap } from "rxjs/operators";
import { Proposal } from "../proposal";
import { ProposalHelperService } from "../proposal-helper.service";
import { Position } from "../position";

@Component({
  selector: 'app-grid-row',
  templateUrl: './grid-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridRowComponent implements OnInit, OnDestroy {
  @ViewChildren('gridRow') gridRows: QueryList<ElementRef>;
  @Input() suppliers: ContragentShortInfo[];
  @Input() proposals: Proposal[];
  @Input() position: Position;
  @Input() chooseBy$: Subject<"date" | "price">;
  @Input() isReviewed: boolean;
  @Input() getProposal: (supplier: ContragentShortInfo) => Proposal;
  @Input() editable: boolean;
  @Output() show = new EventEmitter<Proposal>();
  @HostBinding('class.position-row') positionRow = true;
  readonly selectedProposal = new FormControl(null, Validators.required);
  readonly rejectedProposalPosition = new FormControl(null, Validators.required);
  readonly destroy$ = new Subject();

  constructor(private helper: ProposalHelperService) {}

  ngOnInit() {
    if (this.chooseBy$) {
      this.chooseBy$.pipe(
        tap(() => this.selectedProposal.reset()),
        tap(type => this.selectedProposal.setValue(
          this.helper.chooseBy(type, this.position, this.proposals)
        )),
        tap(type => console.log(this.helper.chooseBy(type, this.position, this.proposals))),
        takeUntil(this.destroy$)
      ).subscribe();
    }

    this.selectedProposal.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(v => {
        // Workaround sync with multiple elements per one formControl
        this.selectedProposal.setValue(v, {onlySelf: true, emitEvent: false});
        this.rejectedProposalPosition.reset(null, {emitEvent: false});
      });

    this.rejectedProposalPosition.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.selectedProposal.reset(null, {emitEvent: false}));
  }

  trackByProposalPositionId = (i, supplier: ContragentShortInfo) => this.getProposal(supplier)?.sourceProposal?.id;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
