import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { timer } from "rxjs";
import { GridSupplier } from "../grid-supplier";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { FormControl } from "@angular/forms";
import { ProposalWithCommonInfo } from "../../../../request/common/models/proposal-with-common-info";
import { RequestPosition } from "../../../../request/common/models/request-position";

@Component({
  selector: 'app-grid-contragents',
  templateUrl: './grid-contragents.component.html',
  styleUrls: ['./grid-contragents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridContragentsComponent implements AfterViewInit, OnChanges, AfterViewChecked {
  @ViewChildren('gridRow') gridRow: QueryList<ElementRef>;
  @ViewChild('gridCommonParams') set gridCommonParameters(gridCommonParams) {
    if (gridCommonParams) {
      this.openCommonParams.emit();
    }
  }
  @Input() gridRows: ElementRef[] | QueryList<ElementRef>;
  @Input() suppliers: GridSupplier[];
  @Input() positionCell: boolean;
  @Input() positions: RequestPosition[];
  @Input() proposals: ProposalWithCommonInfo[];
  @Input() showParams = false;
  @Output() scrollUpdated = new EventEmitter<{ canScrollRight: boolean, canScrollLeft: boolean }>();
  @Output() edit = new EventEmitter();
  @Output() selectBySupplier = new EventEmitter();
  @Output() openCommonParams = new EventEmitter();
  canScrollLeft: boolean;
  canScrollRight: boolean;
  needUpdate: boolean;
  showCommonParams = false;
  showDocsControl = new FormControl(false);


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
    this.gridRow.changes.subscribe(() => this.gridRow.forEach(
      ({ nativeElement }) => nativeElement.scrollLeft = this.gridRow.first.nativeElement.scrollLeft)
    );
  }

  trackBySupplierId = (i, supplier: ContragentShortInfo) => supplier?.id;

  @HostListener('document:keydown.arrowLeft')
  scrollLeft() {
    [...this.gridRows, ...this.gridRow].forEach(({ nativeElement: el }) => el.scrollLeft -= el.scrollLeft % 300 || 300);
    timer(350).subscribe(() => this.updateScroll());
  }

  @HostListener('document:keydown.arrowRight')
  scrollRight() {
    [...this.gridRows, ...this.gridRow].forEach(({ nativeElement: el }) => el.scrollLeft += 300);
    timer(350).subscribe(() => this.updateScroll());
  }

  updateScroll() {
    const { scrollLeft, offsetWidth, scrollWidth } = this.gridRow.first?.nativeElement ?? {};
    this.canScrollLeft = scrollLeft > 0;
    this.canScrollRight = (scrollLeft === 0 || scrollLeft < scrollWidth - offsetWidth) && scrollWidth > offsetWidth;
    this.scrollUpdated.emit({
      canScrollLeft: this.canScrollLeft,
      canScrollRight: this.canScrollLeft,
    });
    this.cd.detectChanges();
  }

  hasSupplierWithAnalogs(suppliers): boolean {
    return suppliers.some(supplier => supplier.hasAnalogs);
  }

  getUniqueSupplierIndex(supplierId): number {
    const uniqueProposalsSuppliers = this.suppliers.filter((supplier, index, array) =>
      !array.filter((v, i) => JSON.stringify(supplier.id) === JSON.stringify(v.id) && i < index).length);
    const uniqueProposalsSupplierIds = uniqueProposalsSuppliers.map(supplier => supplier.id);

    return uniqueProposalsSupplierIds.indexOf(supplierId);
  }

  getProposalBySupplier = ({ id }: ContragentShortInfo, proposals: ProposalWithCommonInfo[]) => proposals.find((p) => (p.supplier?.id ?? p.supplierId) === id);
}
