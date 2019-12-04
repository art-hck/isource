import { AfterViewInit, Component, ContentChildren, OnDestroy, QueryList } from '@angular/core';
import { UxgTabTitleComponent } from "../uxg-tab-title/uxg-tab-title.component";
import { Subscription } from "rxjs";

@Component({
  selector: 'uxg-tabs',
  templateUrl: './uxg-tabs.component.html'
})
export class UxgTabsComponent implements AfterViewInit, OnDestroy {
  @ContentChildren(UxgTabTitleComponent) tabTitle !: QueryList<UxgTabTitleComponent>;
  subscription = new Subscription();
  current: UxgTabTitleComponent;

  get activeTab(): UxgTabTitleComponent {
    return this.tabTitle.find(item => item.active);
  }

  get isTabPrevous(): boolean {
    const tabs = this.tabTitle.toArray();
    return tabs.findIndex(item => item.active) < tabs.indexOf(this.current);
  }

  ngAfterViewInit() {
    this.tabTitle.forEach(tabTitle =>
      this.subscription.add(
        tabTitle.onClick.subscribe(
          () => this.tabTitle.filter(item => item.active).forEach(item => {
            this.current = item;
            item.active = false;
          })
        )
      )
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
