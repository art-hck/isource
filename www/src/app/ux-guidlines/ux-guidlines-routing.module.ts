import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { UxGuidlinesComponent } from "./components/ux-guidlines/ux-guidlines.component";
import { UxgExampleTypographyComponent } from "./components/ux-guidlines/uxg-example-typography/uxg-example-typography.component";
import { UxgExampleControlsComponent } from "./components/ux-guidlines/uxg-example-controls/uxg-example-controls.component";
import { UxgExampleButtonsComponent } from "./components/ux-guidlines/uxg-example-buttons/uxg-example-buttons.component";
import { UxgExampleDropdownComponent } from "./components/ux-guidlines/uxg-example-dropdown/uxg-example-dropdown.component";
import { UxgExampleInputComponent } from "./components/ux-guidlines/uxg-example-input/uxg-example-input.component";
import { UxgExamplePositionStatusComponent } from "./components/ux-guidlines/uxg-example-position-status/uxg-example-position-status.component";
import { UxgExampleTabsComponent } from "./components/ux-guidlines/uxg-example-tabs/uxg-example-tabs.component";
import { UxgExampleIconsComponent } from "./components/ux-guidlines/uxg-example-icons/uxg-example-icons.component";

const routes: Routes = [
  {
    path: "",
    component: UxGuidlinesComponent,
    children: [
      {
        path: "grid-and-typography",
        component: UxgExampleTypographyComponent
      },
      {
        path: "control",
        component: UxgExampleControlsComponent
      },
      {
        path: "button",
        component: UxgExampleButtonsComponent
      },
      {
        path: "dropdown",
        component: UxgExampleDropdownComponent
      },
      {
        path: "input",
        component: UxgExampleInputComponent
      },
      {
        path: "position-status",
        component: UxgExamplePositionStatusComponent
      },
      {
        path: "tab",
        component: UxgExampleTabsComponent
      },
      {
        path: "icon",
        component: UxgExampleIconsComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UxGuidlinesRoutingModule {
}
