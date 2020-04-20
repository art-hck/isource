import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClrAccordionModule, ClrAlertModule, ClrCheckboxModule, ClrDropdownModule, ClrIconModule, ClrLoadingModule, ClrModalModule } from '@clr/angular';
import { DocumentSimpleListComponent } from "./components/document-simple-list/document-simple-list.component";
import { DocumentUploadListComponent } from "./components/document-upload-list/document-upload-list.component";
import { DocumentIconComponent } from "./components/document-icon/document-icon.component";
import { PluralizePipe } from "./pipes/pluralize-pipe";
import { BytesToSizePipe } from "./pipes/bytes-to-size-pipe";
import { SafeStylePipe } from "./pipes/safe-style-pipe";
import { ContragentSearchFilterPipe } from "./pipes/contragent-list-filter-pipe";
import { ControlInvalidClassDirective } from "./directives/control-invalid-class.directive";
import { CountdownTimerPipe } from "./pipes/countdown-timer.pipe";
import { UploadFileDragDirective } from './directives/upload-file-drag.directive';
import { UxgModule } from "uxg";
import { SelectItemsWithSearchComponent } from "./components/select-items-with-search/select-items-with-search.component";
import { SplitNumberPipe } from './pipes/split-number.pipe';
import { UploadFileDirective } from "./directives/upload-file.directive";
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { TemplateUploadComponent } from './components/template-upload/template-upload.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { RouterModule } from "@angular/router";
import { PhonePipe } from './pipes/phone.pipe';
import { SuggestionsDirective } from "./directives/suggestions.directive";
import { HumanDatePipe } from './pipes/human-date.pipe';
import { AddFromExcelComponent } from "./components/add-from-excel/add-from-excel.component";
import { DocumentsFormControlComponent } from "./components/documents-form-control/documents-form-control.component";
import { AppDateIsAfterDirective } from "./directives/app-date-is-after.directive";
import { AppPositionStatusComponent } from "./components/position-status/app-position-status.component";
import { ToastListModule } from "./components/toast-list/toast-list.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ClrModalModule,
    ClrDropdownModule,
    ClrIconModule,
    ClrAlertModule,
    ClrAccordionModule,
    ClrCheckboxModule,
    ClrLoadingModule,
    UxgModule,
    ToastListModule,
  ],
  declarations: [
    DocumentSimpleListComponent,
    DocumentUploadListComponent,
    DocumentIconComponent,
    PluralizePipe,
    BytesToSizePipe,
    SafeStylePipe,
    ContragentSearchFilterPipe,
    CountdownTimerPipe,
    ControlInvalidClassDirective,
    UploadFileDragDirective,
    SelectItemsWithSearchComponent,
    SplitNumberPipe,
    UploadFileDirective,
    TemplateUploadComponent,
    UploadFileDirective,
    PaginationComponent,
    PieChartComponent,
    PhonePipe,
    HumanDatePipe,
    SuggestionsDirective,
    AddFromExcelComponent,
    DocumentsFormControlComponent,
    AppDateIsAfterDirective,
    AppPositionStatusComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ClrModalModule,
    ClrDropdownModule,
    ClrIconModule,
    ClrAlertModule,
    ClrAccordionModule,
    ClrCheckboxModule,
    ClrLoadingModule,
    UxgModule,

    DocumentSimpleListComponent,
    DocumentUploadListComponent,
    DocumentIconComponent,
    TemplateUploadComponent,
    DocumentsFormControlComponent,

    PluralizePipe,
    BytesToSizePipe,
    SafeStylePipe,
    ContragentSearchFilterPipe,
    CountdownTimerPipe,

    ControlInvalidClassDirective,
    UploadFileDragDirective,
    SelectItemsWithSearchComponent,
    SplitNumberPipe,
    UploadFileDirective,
    PaginationComponent,
    PieChartComponent,
    PhonePipe,
    HumanDatePipe,
    SuggestionsDirective,
    AddFromExcelComponent,
    AppDateIsAfterDirective,
    AppPositionStatusComponent,
    ToastListModule,
  ]
})
export class SharedModule {
}
