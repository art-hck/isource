import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UxgExampleTypographyComponent } from "./uxg-example-typography/uxg-example-typography.component";
import { UxgExampleControlsComponent } from "./uxg-example-controls/uxg-example-controls.component";
import { UxgExampleButtonsComponent } from "./uxg-example-buttons/uxg-example-buttons.component";
import { UxgExampleDropdownComponent } from "./uxg-example-dropdown/uxg-example-dropdown.component";
import { UxgExampleInputComponent } from "./uxg-example-input/uxg-example-input.component";
import { UxgExamplePositionStatusComponent } from "./uxg-example-position-status/uxg-example-position-status.component";
import { UxgExampleTabsComponent } from "./uxg-example-tabs/uxg-example-tabs.component";
import { UxgExampleIconsComponent } from "./uxg-example-icons/uxg-example-icons.component";


const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
