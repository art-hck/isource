import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from "./app.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ClarityModule } from "@clr/angular";
import { UxgExampleDropdownComponent } from "./uxg-example-dropdown/uxg-example-dropdown.component";
import { UxgExampleIconsComponent } from "./uxg-example-icons/uxg-example-icons.component";
import { UxgExampleTabsComponent } from "./uxg-example-tabs/uxg-example-tabs.component";
import { UxgExampleButtonsComponent } from "./uxg-example-buttons/uxg-example-buttons.component";
import { UxgExampleControlsComponent } from "./uxg-example-controls/uxg-example-controls.component";
import { UxgExamplePositionStatusComponent } from "./uxg-example-position-status/uxg-example-position-status.component";
import { UxgExampleInputComponent } from "./uxg-example-input/uxg-example-input.component";
import { UxgExampleTypographyComponent } from "./uxg-example-typography/uxg-example-typography.component";
import { UxGuidlinesModule } from "../../../src/app/ux-guidlines/ux-guidlines.module";

@NgModule({
  declarations: [
    AppComponent,
    UxgExampleDropdownComponent,
    UxgExampleIconsComponent,
    UxgExampleTabsComponent,
    UxgExampleButtonsComponent,
    UxgExampleControlsComponent,
    UxgExamplePositionStatusComponent,
    UxgExampleInputComponent,
    UxgExampleTypographyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ClarityModule,
    UxGuidlinesModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
