import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementsComponent } from "./components/agreements/agreements.component";
import { AgreementsService } from "./services/agreements.service";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";


@NgModule({
  declarations: [AgreementsComponent],
  providers: [AgreementsService],
  imports: [
    RouterModule,
    SharedModule,
    CommonModule
  ],
  exports: [AgreementsComponent]
})
export class AgreementsModule {
}
