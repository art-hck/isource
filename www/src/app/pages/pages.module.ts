import { NgModule } from '@angular/core';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { PagesRoutingModule } from "./pages-routing.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    PagesRoutingModule
  ],
  declarations: [
    NotFoundComponent,
    ForbiddenComponent
  ],
  exports: [
    NotFoundComponent
  ]
})
export class PagesModule { }
