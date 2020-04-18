import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, QueryList, ViewChild } from '@angular/core';
import { TechnicalCommercialProposal } from "../../../models/technical-commercial-proposal";
import { timer } from "rxjs";

@Component({
  selector: 'app-technical-commercial-proposal-grid-contragents-row',
  templateUrl: './proposal-grid-contragents.component.html',
})
export class ProposalGridContragentsComponent {
  @ViewChild('gridRow') gridRow: ElementRef;
  @Input() gridRows: QueryList<ElementRef>;
  @Input() proposals: TechnicalCommercialProposal[];

  constructor(private cd: ChangeDetectorRef) {}

  @HostListener('document:keydown.arrowLeft')
  scrollLeft() {
    [...this.gridRows, this.gridRow].forEach(({nativeElement: el}) => el.scrollLeft -= el.scrollLeft % 300 || 300);
    timer(350).subscribe(() => this.cd.detectChanges());
  }

  @HostListener('document:keydown.arrowRight')
  scrollRight() {
    [...this.gridRows, this.gridRow].forEach(({nativeElement: el}) => el.scrollLeft += 300);
    timer(350).subscribe(() => this.cd.detectChanges());
  }

  canScrollLeft = (): boolean => this.gridRow?.nativeElement.scrollLeft > 0;
  canScrollRight = (): boolean => {
    const { scrollLeft, offsetWidth, scrollWidth } = this.gridRow?.nativeElement ?? {};
    return (scrollLeft === 0 || scrollLeft < scrollWidth - offsetWidth) && scrollWidth > offsetWidth;
  }
}
