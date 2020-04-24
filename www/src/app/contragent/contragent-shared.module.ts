import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared.module";
import { ContragentService } from "./services/contragent.service";
import { ContragentInfoComponent } from './components/contragent-info/contragent-info.component';
import { ContragentInfoLinkComponent } from './components/contragent-info-link/contragent-info-link.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ContragentInfoComponent,
    ContragentInfoLinkComponent,
  ],
  exports: [
    ContragentInfoComponent,
    ContragentInfoLinkComponent
  ]
})
export class ContragentSharedModule { }
