import { NgModule } from '@angular/core';
import { KimComponent } from "./components/kim/kim.component";
import { SharedModule } from "../../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    KimComponent
  ],
  imports: [
    RouterModule.forChild([]),
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class KimCommonModule { }
