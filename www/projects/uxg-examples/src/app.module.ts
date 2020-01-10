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
import { UxgExampleControlsComponent, UxgRouterLinkActiveDirective } from "./uxg-example-controls/uxg-example-controls.component";
import { UxgExamplePositionStatusComponent } from "./uxg-example-position-status/uxg-example-position-status.component";
import { UxgExampleInputComponent } from "./uxg-example-input/uxg-example-input.component";
import { UxgExampleTypographyComponent } from "./uxg-example-typography/uxg-example-typography.component";
import { UxgIconShapesSources, UxgModule } from "uxg";
import { PrismModule } from "@ngx-prism/core";
import { ClarityIcons } from "@clr/icons";
import '@clr/icons/shapes/all-shapes';
import { UxgExampleHomeComponent } from './uxg-example-home/uxg-example-home.component';

UxgIconShapesSources.forEach(icon => ClarityIcons.add(icon));

@NgModule({
  declarations: [
    AppComponent,
    UxgExampleDropdownComponent,
    UxgExampleIconsComponent,
    UxgExampleTabsComponent,
    UxgExampleControlsComponent,
    UxgExamplePositionStatusComponent,
    UxgExampleInputComponent,
    UxgExampleTypographyComponent,
    UxgRouterLinkActiveDirective,
    UxgExampleHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ClarityModule,
    PrismModule,
    UxgModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
