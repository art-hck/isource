import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Input, QueryList, ViewChild } from '@angular/core';
import { TechnicalCommercialProposal } from "../../../models/technical-commercial-proposal";
import { timer } from "rxjs";

@Component({
  selector: 'app-technical-commercial-proposal-grid-contragents-row',
  templateUrl: './proposal-grid-contragents.component.html',
  styleUrls: ['./proposal-grid-contragents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProposalGridContragentsComponent implements AfterViewInit {
  @ViewChild('gridRow') gridRow: ElementRef;
  @Input() gridRows: ElementRef[];
  @Input() proposals: TechnicalCommercialProposal[];
  canScrollLeft: boolean;
  canScrollRight: boolean;

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.updateScroll();
  }

  @HostListener('document:keydown.arrowLeft')
  scrollLeft() {
    [...this.gridRows, this.gridRow].forEach(({nativeElement: el}) => el.scrollLeft -= el.scrollLeft % 300 || 300);
    timer(350).subscribe(() => this.updateScroll());
  }

  @HostListener('document:keydown.arrowRight')
  scrollRight() {
    [...this.gridRows, this.gridRow].forEach(({nativeElement: el}) => el.scrollLeft += 300);
    timer(350).subscribe(() => this.updateScroll());
  }

  updateScroll() {
    const { scrollLeft, offsetWidth, scrollWidth } = this.gridRow?.nativeElement ?? {};
    this.canScrollLeft = scrollLeft > 0;
    this.canScrollRight = (scrollLeft === 0 || scrollLeft < scrollWidth - offsetWidth) && scrollWidth > offsetWidth;
    this.cd.detectChanges();
  }

  hasAnalogs(proposal: TechnicalCommercialProposal): boolean {
    return proposal.positions.some(({isAnalog}) => isAnalog);
  }
}
