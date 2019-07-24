import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from "./components/card/card.component";
import { FormsModule } from "@angular/forms";
import { ClarityModule } from '@clr/angular';
import { CustomComponentsModule } from '@stdlib-ng/custom-components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClarityModule,
    CustomComponentsModule
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
export class SharedModule { }
