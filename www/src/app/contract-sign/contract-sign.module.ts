import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractSignRoutingModule } from "./contract-sign-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { ContractSignComponent } from "./components/contract-sign/contract-sign.component";
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [
    ContractSignComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    ContractSignRoutingModule
  ]
})
export class ContractSignModule { }
