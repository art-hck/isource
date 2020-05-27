import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { AgreementsComponent } from "./components/agreements/agreements.component";


@NgModule({
  declarations: [AgreementsComponent],
  imports: [
    RouterModule,
    SharedModule,
    CommonModule
  ],
  exports: [AgreementsComponent]
})
export class AgreementsCommonModule {
}
