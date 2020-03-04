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
import { UxgDropdownItemDirective } from './components/uxg-dropdown/uxg-dropdown-item.directive';
import { UxgInputDirective } from './directives/uxg-input.directive';
import { UxgButtonDirective } from './directives/uxg-button.directive';
import { UxgCodeComponent } from './components/uxg-code/uxg-code.component';
import { UxgBreadcrumbsComponent } from './components/uxg-breadcrumbs/uxg-breadcrumbs.component';
import { RouterModule } from "@angular/router";
import { UxgSelectAllDirective } from "./directives/uxg-select-all.directive";
import { UxgRadioItemComponent } from "./components/uxg-radio/uxg-radio-item.component";
import { UxgTreeComponent, UxgTreeNodeDirective, UxgTreeWrapDirective } from './components/uxg-tree/uxg-tree.component';
import { UxgPopoverComponent } from "./components/uxg-popover/uxg-popover.component";
import { UxgPopoverTriggerDirective } from "./components/uxg-popover/uxg-popover-trigger.directive";
import { UxgPopoverContentDirective } from "./components/uxg-popover/uxg-popover-content.directive";
import { UxgWizzardDirective, UxgWizzardStepDirective } from './components/uxg-wizzard/uxg-wizzard.directive';
import { UxgWizzardButtonDirective } from "./components/uxg-wizzard/uxg-wizzard-button.directive";
import { UxgWizzardStepsComponent } from "./components/uxg-wizzard/uxg-wizzard-steps.component";
import { UxgDropdownInputComponent } from "./components/uxg-dropdown-input/uxg-dropdown-input.component";


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
