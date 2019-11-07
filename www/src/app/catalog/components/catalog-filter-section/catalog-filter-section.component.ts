import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-catalog-filter-section',
  templateUrl: 'catalog-filter-section.component.html',
  styleUrls: ['./catalog-filter-section.component.scss']
})

export class CatalogFilterSectionComponent {
  @Input() label;
  @Input() isShowed = true;
}
