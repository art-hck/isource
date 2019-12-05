import { AppIconShapesSources } from "./ux-guidlines.icons";
import { ClarityIcons } from "@clr/icons";
import { ClarityModule } from "@clr/angular";
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { UxGuidlinesComponent } from "./components/ux-guidlines/ux-guidlines.component";
import { UxgCheckboxComponent } from "./components/uxg-checkbox/uxg-checkbox.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UxgTabDirective } from './directives/uxg-tab.directive';
import { UxgTabTitleComponent } from './components/uxg-tab-title/uxg-tab-title.component';
import { UxgTabsComponent } from './components/uxg-tabs/uxg-tabs.component';

AppIconShapesSources.forEach(icon => ClarityIcons.add(icon));

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: "",
      component: UxGuidlinesComponent
    }]),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ClarityModule
  ],
  declarations: [
    UxGuidlinesComponent,
    UxgCheckboxComponent,
    UxgTabDirective,
    UxgTabTitleComponent,
    UxgTabsComponent
  ],
  exports: [
    UxgCheckboxComponent,
    UxgTabsComponent,
    UxgTabTitleComponent,
    UxgTabDirective
  ],
})
export class UxGuidlinesModule {
}
