import { UxgIconShapesSources } from "./ux-guidlines.icons";
import { ClarityIcons } from "@clr/icons";
import { ClarityModule } from "@clr/angular";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { UxgCheckboxComponent } from "./components/uxg-checkbox/uxg-checkbox.component";
import { UxgTabDirective } from './directives/uxg-tab.directive';
import { UxgTabTitleComponent } from './components/uxg-tab-title/uxg-tab-title.component';
import { UxgTabsComponent } from './components/uxg-tabs/uxg-tabs.component';
import { UxgPositionStatusComponent } from './components/uxg-position-status/uxg-position-status.component';
import { UxgSwitcherComponent } from './components/uxg-switcher/uxg-switcher.component';
import { UxGuidlinesComponent } from "./components/ux-guidlines/ux-guidlines.component";
import { UxgDropdownComponent } from './components/uxg-dropdown/uxg-dropdown.component';
import { UxgDropdownItemDirective } from './directives/uxg-dropdown-item.directive';
import { UxgInputDirective } from './directives/uxg-input.directive';
import { UxgButtonDirective } from './directives/uxg-button.directive';
import { PrismModule } from '@ngx-prism/core';
import { UxgExampleDropdownComponent } from './components/ux-guidlines/uxg-example-dropdown/uxg-example-dropdown.component';
import { UxgExampleIconsComponent } from './components/ux-guidlines/uxg-example-icons/uxg-example-icons.component';
import { UxgExampleTabsComponent } from './components/ux-guidlines/uxg-example-tabs/uxg-example-tabs.component';
import { UxgExampleButtonsComponent } from './components/ux-guidlines/uxg-example-buttons/uxg-example-buttons.component';
import { UxgExampleControlsComponent } from './components/ux-guidlines/uxg-example-controls/uxg-example-controls.component';
import { UxgExamplePositionStatusComponent } from './components/ux-guidlines/uxg-example-position-status/uxg-example-position-status.component';
import { UxgExampleInputComponent } from './components/ux-guidlines/uxg-example-input/uxg-example-input.component';
import { UxgExampleTypographyComponent } from './components/ux-guidlines/uxg-example-typography/uxg-example-typography.component';
import { UxGuidlinesRoutingModule } from "./ux-guidlines-routing.module";

UxgIconShapesSources.forEach(icon => ClarityIcons.add(icon));

@NgModule({
  imports: [
    UxGuidlinesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ClarityModule,
    PrismModule
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
    UxGuidlinesComponent,
    UxgInputDirective,
    UxgButtonDirective,
    UxgButtonDirective,
    UxgExampleDropdownComponent,
    UxgExampleIconsComponent,
    UxgExampleTabsComponent,
    UxgExampleButtonsComponent,
    UxgExampleControlsComponent,
    UxgExamplePositionStatusComponent,
    UxgExampleInputComponent,
    UxgExampleTypographyComponent
  ],
  exports: [
    UxgCheckboxComponent,
    UxgDropdownComponent,
    UxgDropdownItemDirective,
    UxgPositionStatusComponent,
    UxgSwitcherComponent,
    UxgTabDirective,
    UxgTabsComponent,
    UxgTabTitleComponent
  ],
})
export class UxGuidlinesModule {
}
