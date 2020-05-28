import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { AgreementsDeprecatedComponent } from "./components/agreements-deprecated/agreements-deprecated.component";
import { AgreementsComponent } from './components/agreements/agreements.component';


@NgModule({
  declarations: [AgreementsDeprecatedComponent, AgreementsComponent],
  imports: [
    RouterModule,
    SharedModule,
    CommonModule
  ],
  exports: [AgreementsDeprecatedComponent, AgreementsComponent]
})
export class AgreementsCommonModule {
}
