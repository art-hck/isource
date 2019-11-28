import { AppIconShapesSources } from "./ux-guidlines.icons";
import { ClarityIcons } from "@clr/icons";
import { ClarityModule } from "@clr/angular";
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { UxGuidlinesComponent } from "./components/ux-guidlines/ux-guidlines.component";
import { UxgCheckboxComponent } from "./components/uxg-checkbox/uxg-checkbox.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

AppIconShapesSources.forEach(icon => ClarityIcons.add(icon));

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: "",
      component: UxGuidlinesComponent
    }]),
    FormsModule,
    ReactiveFormsModule,
    ClarityModule
  ],
  declarations: [
    UxGuidlinesComponent,
    UxgCheckboxComponent
  ],
  exports: [
    UxgCheckboxComponent
  ],
})
export class UxGuidlinesModule {
}
