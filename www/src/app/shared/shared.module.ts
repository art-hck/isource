import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from "./components/card/card.component";
import { FormsModule } from "@angular/forms";
import { ClarityModule } from '@clr/angular';
import { CustomComponentsModule } from '@stdlib-ng/custom-components';
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClarityModule,
    CustomComponentsModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: {
        popup: 'alert-popup',
        header: 'alert-header',
        title: 'alert-title',
        closeButton: 'alert-close-button',
        content: 'alert-content',
        actions: 'alert-actions',
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn'
      },
      confirmButtonText: 'Да',
      cancelButtonText: 'Отмена',
      width: '16rem',
      reverseButtons: true
    })
  ],
  declarations: [
    CardComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ClarityModule,
    CustomComponentsModule,
    CardComponent,
    SweetAlert2Module
  ]
})
export class SharedModule {
}
