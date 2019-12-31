import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from "./components/card/card.component";
import { FormsModule } from "@angular/forms";
import { ClarityModule } from '@clr/angular';
import { CustomComponentsModule } from '@stdlib-ng/custom-components';
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { DocumentSimpleListComponent } from "./components/document-simple-list/document-simple-list.component";
import { DocumentUploadListComponent } from "./components/document-upload-list/document-upload-list.component";
import { DocumentIconComponent } from "./components/document-icon/document-icon.component";
import { PluralizePipe } from "./pipes/pluralize-pipe";
import { BytesToSizePipe } from "./pipes/bytes-to-size-pipe";
import { SafeStylePipe } from "./pipes/safe-style-pipe";
import { ContragentSearchFilterPipe } from "./pipes/contragent-list-filter-pipe";
import { ControlInvalidClassDirective } from "./directives/control-invalid-class.directive";
import { CountdownTimerPipe } from "./pipes/countdown-timer.pipe";
import { DragFileUploadDirective } from './directives/drag-file-upload.directive';
import { UxgModule } from "uxg";
import { ContragentAutocompleteComponent } from './components/contragent-autocomplete/contragent-autocomplete.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClarityModule,
    CustomComponentsModule,
    UxgModule,
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
    CardComponent,
    DocumentSimpleListComponent,
    DocumentUploadListComponent,
    DocumentIconComponent,
    ContragentAutocompleteComponent,
    PluralizePipe,
    BytesToSizePipe,
    SafeStylePipe,
    ContragentSearchFilterPipe,
    CountdownTimerPipe,
    ControlInvalidClassDirective,
    DragFileUploadDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    ClarityModule,
    CustomComponentsModule,
    SweetAlert2Module,
    UxgModule,

    CardComponent,
    DocumentSimpleListComponent,
    DocumentUploadListComponent,
    DocumentIconComponent,
    ContragentAutocompleteComponent,

    PluralizePipe,
    BytesToSizePipe,
    SafeStylePipe,
    ContragentSearchFilterPipe,
    CountdownTimerPipe,

    ControlInvalidClassDirective,
    DragFileUploadDirective
  ]
})
export class SharedModule {
}
