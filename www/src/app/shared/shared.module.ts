import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardComponent} from "./components/card/card.component";
import {FormsModule} from "@angular/forms";
import {ClarityModule} from '@clr/angular';
import {CustomComponentsModule} from '@stdlib-ng/custom-components';
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClarityModule,
    CustomComponentsModule,
    SweetAlert2Module
  ],
  declarations: [
    CardComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ClarityModule,
    CustomComponentsModule,
    CardComponent
  ]
})
export class SharedModule {
}
