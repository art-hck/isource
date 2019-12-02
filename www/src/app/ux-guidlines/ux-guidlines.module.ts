import { AppIconShapesSources } from "./ux-guidlines.icons";
import { ClarityIcons } from "@clr/icons";
import { ClarityModule } from "@clr/angular";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { UxgCheckboxComponent } from "./components/uxg-checkbox/uxg-checkbox.component";
import { UxgPositionStatusComponent } from './components/uxg-position-status/uxg-position-status.component';
import { UxgSwitcherComponent } from './components/uxg-switcher/uxg-switcher.component';
import { UxGuidlinesComponent } from "./components/ux-guidlines/ux-guidlines.component";

AppIconShapesSources.forEach(icon => ClarityIcons.add(icon));

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: "",
      component: UxGuidlinesComponent
    }]),
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ClarityModule
  ],
  declarations: [
    UxGuidlinesComponent,
    UxgCheckboxComponent,
    UxgSwitcherComponent,
    UxgPositionStatusComponent
  ],
  exports: [
    UxgCheckboxComponent,
    UxgSwitcherComponent
  ],
})
export class UxGuidlinesModule {
}
