import { AfterViewInit, Component, ContentChildren, ElementRef, HostBinding, OnDestroy, QueryList, ViewChild } from '@angular/core';
import { UxgTabTitleComponent } from "../uxg-tab-title/uxg-tab-title.component";
import { fromEvent, Subscription } from "rxjs";
import { debounceTime, filter } from "rxjs/operators";

@Component({
  selector: 'uxg-tabs',
  templateUrl: './uxg-tabs.component.html'
})
export class UxgTabsComponent implements AfterViewInit, OnDestroy {

  @HostBinding('class.app-tabs-wrap') appTabs = true;
  @ViewChild('appTabsScroll', { static: false }) appTabsScroll: ElementRef;
  @ContentChildren(UxgTabTitleComponent) tabTitle !: QueryList<UxgTabTitleComponent>;

  subscription = new Subscription();
  current: UxgTabTitleComponent;
  hasScroll = false;

  get activeTab(): UxgTabTitleComponent {
    return this.tabTitle.find(item => item.active);
  }

  get isTabPrevous(): boolean {
    const tabs = this.tabTitle.toArray();
    return tabs.findIndex(item => item.active) < tabs.indexOf(this.current);
  }

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.tabTitle.forEach(
      tabTitle => this.subscription.add(
        tabTitle.onToggle
          .pipe(filter(Boolean))
          .subscribe(
            () => this.tabTitle.filter(item => item.active).forEach(item => {
              this.current = item;
              item.deactivate();
            })
          )
      )
    );

    setTimeout(() => this.updateScroll());
    fromEvent(window, 'resize').pipe(debounceTime(150))
      .subscribe(() => this.updateScroll());
  }

  updateScroll() {
    this.hasScroll = this.el.nativeElement.scrollWidth < this.appTabsScroll.nativeElement.scrollWidth;
  }

  slideLeft() {
    this.appTabsScroll.nativeElement.scrollLeft -= this.el.nativeElement.scrollWidth / 2;
  }

  slideRight() {
    this.appTabsScroll.nativeElement.scrollLeft += this.el.nativeElement.scrollWidth / 2;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
