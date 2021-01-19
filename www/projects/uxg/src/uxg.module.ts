import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { UxgBreadcrumbsModule } from "./modules/breadcrumbs/uxg-breadcrumbs.module";
import { UxgButtonModule } from "./modules/button/uxg-button.module";
import { UxgCheckboxModule } from "./modules/checkbox/uxg-checkbox.module";
import { UxgCodeModule } from "./modules/code/uxg-code.module";
import { UxgDropdownModule } from "./modules/dropdown/uxg-dropdown.module";
import { UxgDropdownInputModule } from "./modules/dropdown-input/uxg-dropdown-input.module";
import { UxgInputModule } from "./modules/input/uxg-input.module";
import { UxgPopoverModule } from "./modules/popover/uxg-popover.module";
import { UxgRadioModule } from "./modules/radio/uxg-radio.module";
import { UxgSwitcherModule } from "./modules/switcher/uxg-switcher.module";
import { UxgTabModule } from "./modules/tab/uxg-tab.module";
import { UxgTreeModule } from "./modules/tree/uxg-tree.module";
import { UxgWizzardModule } from "./modules/wizzard/uxg-wizzard.module";
import { UxgIconModule } from "./modules/icon/uxg-icon.module";
import { UxgDatepickerModule } from "./modules/datepicker/uxg-datepicker.module";
import { UxgModalModule } from "./modules/modal/uxg-modal.module";
import { UxgPaginationModule } from "./modules/pagination/uxg-pagination.module";
import { UxgFilterModule } from "./modules/filter/uxg-filter.module";


@NgModule({
  imports: [
    CommonModule,
    UxgBreadcrumbsModule,
    UxgButtonModule,
    UxgCheckboxModule,
    UxgCodeModule,
    UxgDatepickerModule,
    UxgDropdownInputModule,
    UxgDropdownModule,
    UxgIconModule,
    UxgInputModule,
    UxgFilterModule,
    UxgModalModule,
    UxgPaginationModule,
    UxgPopoverModule,
    UxgRadioModule,
    UxgSwitcherModule,
    UxgTabModule,
    UxgTreeModule,
    UxgWizzardModule,
  ],
  exports: [
    UxgBreadcrumbsModule,
    UxgButtonModule,
    UxgCheckboxModule,
    UxgCodeModule,
    UxgDatepickerModule,
    UxgDropdownInputModule,
    UxgDropdownModule,
    UxgIconModule,
    UxgInputModule,
    UxgFilterModule,
    UxgModalModule,
    UxgPaginationModule,
    UxgPopoverModule,
    UxgRadioModule,
    UxgSwitcherModule,
    UxgTabModule,
    UxgTreeModule,
    UxgWizzardModule,
  ],
})
export class UxgModule {
}
