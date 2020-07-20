import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { AgreementsComponent } from './components/agreements/agreements.component';
import { AgreementsListFilterComponent } from "./components/agreements/agreements-list-filter/agreements-list-filter.component";
import { FilterSectionComponent } from "./components/agreements/agreements-list-filter/filter-section/filter-section.component";
import { ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    AgreementsComponent,
    AgreementsListFilterComponent,
    FilterSectionComponent
  ],
  imports: [
    RouterModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    AgreementsComponent,
    AgreementsListFilterComponent
  ]
})
export class AgreementsCommonModule {
}
