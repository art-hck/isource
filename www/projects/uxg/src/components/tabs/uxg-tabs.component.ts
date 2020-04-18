import { AfterViewInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, HostBinding, OnDestroy, QueryList, ViewChild } from '@angular/core';
import { UxgTabTitleComponent } from "../tab-title/uxg-tab-title.component";
import { fromEvent, Subject } from "rxjs";
import { debounceTime, filter, flatMap, mapTo, mergeAll, startWith, takeUntil, tap } from "rxjs/operators";

@Component({
  selector: 'uxg-tabs',
  templateUrl: './uxg-tabs.component.html'
})
export class UxgTabsComponent implements AfterViewInit, OnDestroy {

  @HostBinding('class.app-tabs-wrap') appTabs = true;
  @ViewChild('appTabsScroll') appTabsScroll: ElementRef;
  @ContentChildren(UxgTabTitleComponent) tabTitle !: QueryList<UxgTabTitleComponent>;

  destroy$ = new Subject();
  hasScroll = false;
  activeTab: UxgTabTitleComponent;
  isTabPrevous: boolean;

  constructor(private el: ElementRef, private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.tabTitle.changes.pipe(
      startWith(this.tabTitle),
      tap(() => this.updateScroll()),
      flatMap((tabs: QueryList<UxgTabTitleComponent>) => {
        return tabs.map(tab => tab.onToggle.pipe(startWith(tab.active), filter(Boolean), mapTo(tab)));
      }),
      mergeAll(),
      takeUntil(this.destroy$)
    ).subscribe(tab => {
      const tabs = this.tabTitle.toArray();
      tabs.filter(item => item !== tab).forEach(item => item.deactivate());
      this.isTabPrevous = tabs.indexOf(tab) < tabs.indexOf(this.activeTab);
      this.activeTab = tab;
      this.cd.detectChanges();
    });

    fromEvent(window, 'resize')
      .pipe(debounceTime(150), takeUntil(this.destroy$))
      .subscribe(this.updateScroll);
  }

  updateScroll = () => {
    this.hasScroll = this.el.nativeElement.scrollWidth < this.appTabsScroll.nativeElement.scrollWidth;
    this.cd.detectChanges();
  }

  slideLeft = () => this.appTabsScroll.nativeElement.scrollLeft -= this.el.nativeElement.scrollWidth / 2;
  slideRight = () => this.appTabsScroll.nativeElement.scrollLeft += this.el.nativeElement.scrollWidth / 2;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
