import { ClrIconModule } from "@clr/angular";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from '@angular/core';
import { UxgCheckboxComponent } from "./components/checkbox/uxg-checkbox.component";
import { UxgTabDirective } from './directives/uxg-tab.directive';
import { UxgTabTitleComponent } from './components/tab-title/uxg-tab-title.component';
import { UxgTabsComponent } from './components/tabs/uxg-tabs.component';
import { UxgPositionStatusComponent } from './components/position-status/uxg-position-status.component';
import { UxgSwitcherComponent } from './components/switcher/uxg-switcher.component';
import { UxgDropdownComponent } from './components/dropdown/uxg-dropdown.component';
import { UxgDropdownItemDirective } from './components/dropdown/uxg-dropdown-item.directive';
import { UxgInputDirective } from './directives/uxg-input.directive';
import { UxgButtonDirective } from './directives/uxg-button.directive';
import { UxgCodeComponent } from './components/code/uxg-code.component';
import { UxgBreadcrumbsComponent } from './components/breadcrumbs/uxg-breadcrumbs.component';
import { RouterModule } from "@angular/router";
import { UxgSelectAllDirective } from "./directives/uxg-select-all.directive";
import { UxgRadioItemComponent } from "./components/radio/uxg-radio-item.component";
import { UxgTreeComponent, UxgTreeNodeDirective, UxgTreeWrapDirective } from './components/tree/uxg-tree.component';
import { UxgPopoverComponent } from "./components/popover/uxg-popover.component";
import { UxgPopoverTriggerDirective } from "./components/popover/uxg-popover-trigger.directive";
import { UxgPopoverContentDirective } from "./components/popover/uxg-popover-content.directive";
import { UxgWizzardDirective, UxgWizzardStepDirective } from './components/wizzard/uxg-wizzard.directive';
import { UxgWizzardButtonDirective } from "./components/wizzard/uxg-wizzard-button.directive";
import { UxgWizzardStepsComponent } from "./components/wizzard/uxg-wizzard-steps.component";
import { UxgDropdownInputComponent } from "./components/dropdown-input/uxg-dropdown-input.component";


@NgModule({
  imports: [
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    ClrIconModule,
  ],
  declarations: [
    UxgCheckboxComponent,
    UxgDropdownComponent,
    UxgDropdownItemDirective,
    UxgDropdownInputComponent,
    UxgPositionStatusComponent,
    UxgSwitcherComponent,
    UxgTabDirective,
    UxgTabsComponent,
    UxgTabTitleComponent,
    UxgInputDirective,
    UxgButtonDirective,
    UxgRadioItemComponent,
    UxgSelectAllDirective,
    UxgCodeComponent,
    UxgBreadcrumbsComponent,
    UxgTreeComponent,
    UxgTreeNodeDirective,
    UxgTreeWrapDirective,
    UxgPopoverComponent,
    UxgPopoverContentDirective,
    UxgPopoverTriggerDirective,
    UxgWizzardDirective,
    UxgWizzardStepDirective,
    UxgWizzardButtonDirective,
    UxgWizzardStepsComponent
  ],
  exports: [
    UxgCheckboxComponent,
    UxgDropdownComponent,
    UxgDropdownItemDirective,
    UxgDropdownInputComponent,
    UxgPositionStatusComponent,
    UxgSwitcherComponent,
    UxgTabDirective,
    UxgTabsComponent,
    UxgTabTitleComponent,
    UxgBreadcrumbsComponent,
    UxgCodeComponent,
    UxgInputDirective,
    UxgButtonDirective,
    UxgRadioItemComponent,
    UxgSelectAllDirective,
    UxgTreeComponent,
    UxgTreeNodeDirective,
    UxgTreeWrapDirective,
    UxgPopoverComponent,
    UxgPopoverContentDirective,
    UxgPopoverTriggerDirective,
    UxgWizzardDirective,
    UxgWizzardStepDirective,
    UxgWizzardButtonDirective,
    UxgWizzardStepsComponent
  ],
})
export class UxgModule {
}
