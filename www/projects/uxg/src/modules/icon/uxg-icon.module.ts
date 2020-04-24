import { NgModule } from '@angular/core';
import { ClrIconModule } from "@clr/angular";
import { UxgIconComponent } from "./uxg-icon.component";


@NgModule({
  imports: [ClrIconModule],
  declarations: [UxgIconComponent],
  exports: [UxgIconComponent, ClrIconModule],
})
export class UxgIconModule {
}
