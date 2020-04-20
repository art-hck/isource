import { NgModule } from '@angular/core';
import { UxgDropdownInputComponent } from "./uxg-dropdown-input.component";
import { UxgInputModule } from "../input/uxg-input.module";
import { CommonModule } from "@angular/common";


@NgModule({
  imports: [CommonModule, UxgInputModule],
  declarations: [UxgDropdownInputComponent],
  exports: [UxgDropdownInputComponent],
})
export class UxgDropdownInputModule {
}
