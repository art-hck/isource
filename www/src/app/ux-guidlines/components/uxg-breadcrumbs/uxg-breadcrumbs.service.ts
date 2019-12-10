import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from "@angular/router";
import { UxgBreadcrumbs } from "./uxg-breadcrumbs";

@Injectable({
  providedIn: 'root'
})
export class UxgBreadcrumbsService {
  public breadcrumbs: UxgBreadcrumbs = [];

  public fromActivatedRoute(route: ActivatedRouteSnapshot, link = '', bc: UxgBreadcrumbs = []): UxgBreadcrumbs {
    const children: ActivatedRouteSnapshot[] = route.children;

    children.forEach(child => {
      const url = child.url.map(segment => segment.path).join('/');
      const label = child.data['title'];

      if (url !== '') {
        link += `/${url}`;
      }

      if (label !== undefined && label !== null) {
        bc.push({ label, link });
      }

      return this.fromActivatedRoute(child, link, bc);
    });

    return bc;
  }
}
