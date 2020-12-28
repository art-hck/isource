import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UxgPaginationComponent } from "./uxg-pagination.component";
import { UxgIconModule } from "../icon/uxg-icon.module";
import { RouterModule } from "@angular/router";



@NgModule({
  imports: [CommonModule, UxgIconModule, RouterModule],
  declarations: [UxgPaginationComponent],
  exports: [UxgPaginationComponent],
})
export class UxgPaginationModule { }
