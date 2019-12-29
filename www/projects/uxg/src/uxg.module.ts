import { ClarityModule } from "@clr/angular";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from '@angular/core';
import { UxgCheckboxComponent } from "./components/uxg-checkbox/uxg-checkbox.component";
import { UxgTabDirective } from './directives/uxg-tab.directive';
import { UxgTabTitleComponent } from './components/uxg-tab-title/uxg-tab-title.component';
import { UxgTabsComponent } from './components/uxg-tabs/uxg-tabs.component';
import { UxgPositionStatusComponent } from './components/uxg-position-status/uxg-position-status.component';
import { UxgSwitcherComponent } from './components/uxg-switcher/uxg-switcher.component';
import { UxgDropdownComponent } from './components/uxg-dropdown/uxg-dropdown.component';
import { UxgDropdownItemDirective } from './directives/uxg-dropdown-item.directive';
import { UxgInputDirective } from './directives/uxg-input.directive';
import { UxgButtonDirective } from './directives/uxg-button.directive';
import { UxgCodeComponent } from './components/uxg-code/uxg-code.component';
import { UxgBreadcrumbsComponent } from './components/uxg-breadcrumbs/uxg-breadcrumbs.component';
import { RouterModule } from "@angular/router";
import { UxgSelectAllDirective } from "./directives/uxg-select-all.directive";


@NgModule({
  imports: [
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    ClarityModule,
  ],
  declarations: [
    UxgCheckboxComponent,
    UxgDropdownComponent,
    UxgDropdownItemDirective,
    UxgPositionStatusComponent,
    UxgSwitcherComponent,
    UxgTabDirective,
    UxgTabsComponent,
    UxgTabTitleComponent,
    UxgInputDirective,
    UxgButtonDirective,
    UxgSelectAllDirective,
    UxgCodeComponent,
    UxgBreadcrumbsComponent
  ],
  exports: [
    UxgCheckboxComponent,
    UxgDropdownComponent,
    UxgDropdownItemDirective,
    UxgPositionStatusComponent,
    UxgSwitcherComponent,
    UxgTabDirective,
    UxgTabsComponent,
    UxgTabTitleComponent,
    UxgBreadcrumbsComponent,
    UxgCodeComponent,
    UxgInputDirective,
    UxgButtonDirective,
    UxgSelectAllDirective
  ],
})
export class UxgModule {
}
