import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, QueryList, SimpleChanges, ViewChild } from '@angular/core';
import { timer } from "rxjs";
import { GridSupplier } from "../grid-supplier";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { TechnicalCommercialProposal } from "../../../../request/common/models/technical-commercial-proposal";
import { Procedure } from "../../../../request/back-office/models/procedure";
import { TechnicalCommercialProposalByPosition } from "../../../../request/common/models/technical-commercial-proposal-by-position";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { UserInfoService } from "../../../../user/service/user-info.service";

@Component({
  selector: 'app-grid-contragents',
  templateUrl: './grid-contragents.component.html',
  styleUrls: ['./grid-contragents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridContragentsComponent implements AfterViewInit, OnChanges, AfterViewChecked {
  @ViewChild('gridRow') gridRow: ElementRef;
  @Input() gridRows: ElementRef[] | QueryList<ElementRef>;
  @Input() suppliers: GridSupplier[];
  @Input() positionCell: boolean;
  @Output() scrollUpdated = new EventEmitter<{ canScrollRight: boolean, canScrollLeft: boolean }>();
  @Input() proposals: TechnicalCommercialProposal[];
  @Input() proposalsByPos: TechnicalCommercialProposalByPosition[];
  @Input() showParams = false;
  @Output() editTkp = new EventEmitter<TechnicalCommercialProposal>();
  canScrollLeft: boolean;
  canScrollRight: boolean;
  needUpdate: boolean;
  showCommonParams = false;


  constructor(private cd: ChangeDetectorRef,
              public userInfoService: UserInfoService) {}

  ngAfterViewChecked() {
    if (this.needUpdate) {
      this.needUpdate = false;
      setTimeout(() => this.updateScroll());
    }
  }

  ngOnChanges({ suppliers }: SimpleChanges) {
    if (suppliers && !suppliers.firstChange) {
      this.needUpdate = true;
    }
  }

  ngAfterViewInit() {
    this.updateScroll();
  }

  trackBySupplierId = (i, supplier: ContragentShortInfo) => supplier?.id;

  @HostListener('document:keydown.arrowLeft')
  scrollLeft() {
    [...this.gridRows, this.gridRow].forEach(({ nativeElement: el }) => el.scrollLeft -= el.scrollLeft % 300 || 300);
    timer(350).subscribe(() => this.updateScroll());
  }

  @HostListener('document:keydown.arrowRight')
  scrollRight() {
    [...this.gridRows, this.gridRow].forEach(({ nativeElement: el }) => el.scrollLeft += 300);
    timer(350).subscribe(() => this.updateScroll());
  }

  updateScroll() {
    const { scrollLeft, offsetWidth, scrollWidth } = this.gridRow?.nativeElement ?? {};
    this.canScrollLeft = scrollLeft > 0;
    this.canScrollRight = (scrollLeft === 0 || scrollLeft < scrollWidth - offsetWidth) && scrollWidth > offsetWidth;
    this.scrollUpdated.emit({
      canScrollLeft: this.canScrollLeft,
      canScrollRight: this.canScrollLeft,
    });
    this.cd.detectChanges();
  }

  getProposalBySupplier = ({ id }: ContragentShortInfo, proposals: TechnicalCommercialProposal[]) => proposals.find(({supplier}) => supplier.id === id);
}
