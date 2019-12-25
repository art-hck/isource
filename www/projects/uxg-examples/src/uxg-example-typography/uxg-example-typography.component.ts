import { Component } from '@angular/core';
import { UxgBreadcrumbsService } from "uxg";

@Component({
  selector: 'uxg-example-typography',
  templateUrl: './uxg-example-typography.component.html'
})
export class UxgExampleTypographyComponent {
  constructor(public breadcrumbsService: UxgBreadcrumbsService) {
    // Here is generating breadcrumbs logic ...
    this.breadcrumbsService.breadcrumbs = [
      { label: "Home", link: "/" },
      { label: "Page1", link: "/page1" },
      { label: "Page2", link: "/page1" }
    ];
  }

  readonly example1 = `<h1>H1 title</h1>
<h2>H2 title</h2>
<h3>H3 title</h3>
<h4>H4 title</h4>
<p>Paragraph</p>
<small>small text</small>`;

  readonly example2 = `<!-- Example with right aside -->
<div class="app-row">
  <div class="app-col" style="border:1px #ccc dotted">Main column</div>
  <div class="app-col app-col-aside" style="border:1px #ccc dotted">Aside column</div>
</div>

<!-- Example with left aside -->
<div class="app-row">
  <div class="app-col" style="border:1px #ccc dotted">Main column</div>
  <div class="app-col app-col-aside" style="border:1px #ccc dotted">Aside column</div>
</div>

<!-- Example with both asides -->
<div class="app-row">
  <div class="app-col app-col-aside" style="border:1px #ccc dotted">Aside column</div>
  <div class="app-col" style="border:1px #ccc dotted">Main column</div>
  <div class="app-col app-col-aside" style="border:1px #ccc dotted">Aside column</div>
</div>
`;
  readonly example3 = `<div class="app-row">
  <div class="app-col app-bold">ID</div>
  <div class="app-col app-bold">Name</div>
  <div class="app-col app-bold">Age</div>
</div>
<div class="app-row">
  <div class="app-col">1</div>
  <div class="app-col">Mike</div>
  <div class="app-col">21</div>
</div>
<div class="app-row">
  <div class="app-col">2</div>
  <div class="app-col">Jhon</div>
  <div class="app-col">24</div>
</div>
<div class="app-row">
  <div class="app-col">3</div>
  <div class="app-col">Alice</div>
  <div class="app-col">19</div>
</div>`;

  readonly example4 = `<div class="app-table">
  <div class="app-row">
    <div class="app-col">1</div>
    <div class="app-col">Mike</div>
    <div class="app-col">21</div>
  </div>
  <div class="app-row">
    <div class="app-col">2</div>
    <div class="app-col">Jhon</div>
    <div class="app-col">24</div>
  </div>
  <div class="app-row">
    <div class="app-col">3</div>
    <div class="app-col">Alice</div>
    <div class="app-col">19</div>
  </div>
</div>`;

  readonly example5 = `<div class="app-table app-no-border">
  <div class="app-row">
    <div class="app-col">1</div>
    <div class="app-col">Mike</div>
    <div class="app-col">21</div>
  </div>
  <div class="app-row">
    <div class="app-col">2</div>
    <div class="app-col">Jhon</div>
    <div class="app-col">24</div>
  </div>
  <div class="app-row">
    <div class="app-col">3</div>
    <div class="app-col">Alice</div>
    <div class="app-col">19</div>
  </div>
</div>`;

  readonly example6 = `<uxg-breadcrumbs [breadcrumbs]="breadcrumbsService.breadcrumbs"></uxg-breadcrumbs>`;
  readonly example6_1 = `constructor(public breadcrumbsService: UxgBreadcrumbsService) {
  // Here is generating breadcrumbs logic ...
  this.breadcrumbsService.breadcrumbs = [
    { label: "Home", link: "/" },
    { label: "Page1", link: "/page1" },
    { label: "Page2", link: "/page1" }
  ];
}`;
}
