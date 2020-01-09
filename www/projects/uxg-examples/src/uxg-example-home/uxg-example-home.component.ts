import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'uxg-uxg-example-home',
  templateUrl: './uxg-example-home.component.html'
})
export class UxgExampleHomeComponent {
  tsconfigJson = `{
  ...
  "compilerOptions": {
    ...
    "paths": {
      ...
      "uxg": ["dist/uxg"]
    }
  }
}`;
  angularJson = `{
  ....
  "projects": {
      .........
      "uxg": {
      "projectType": "library",
      "root": "projects/uxg",
      "sourceRoot": "projects/uxg/src",
      "prefix": "uxg",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-ng-packagr:build",
          "options": {
            "tsConfig": "projects/uxg/tsconfig.json",
            "project": "projects/uxg/ng-package.json"
          }
        }
      }
    }
  }
}`;

  module = `import { UxgIconShapesSources, UxgModule } from "uxg";
import { AppComponent } from "./app.component";

UxgIconShapesSources.forEach(icon => ClarityIcons.add(icon));

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        UxgModule,
        ...
     ],
     declarations: [ AppComponent ],
     bootstrap: [ AppComponent ]
})
export class AppModule { }`;
}
