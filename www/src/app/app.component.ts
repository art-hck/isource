import { Component } from '@angular/core';
import {filter, map, mergeMap} from "rxjs/operators";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'The Mall';

  constructor(
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === "primary"),
        mergeMap(route => route.data),
        filter(event => event["title"] !== undefined),
        map(event => event["title"])
      ).subscribe((title) => {
        this.titleService.setTitle(title);
      })
    ;
  }
}
