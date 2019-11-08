import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { debounceTime, filter, flatMap, switchMap, tap } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { CatalogService } from "../../services/catalog.service";
import { CatalogCategoryFilter } from "../../models/catalog-category-filter";

@Component({
  selector: 'app-catalog-filter',
  templateUrl: 'catalog-filter.component.html',
  styleUrls: ['./catalog-filter.component.scss']
})

export class CatalogFilterComponent implements OnInit, OnDestroy {
  @Output() filter = new EventEmitter<CatalogCategoryFilter>();
  private subscription: Subscription = new Subscription();

  public form = new FormGroup({
    'availability': new FormControl({value: true, disabled: true}),
    'price': new FormControl({value: [0, 1000], disabled: true}),
    'attributes': new FormArray([])
  });

  get attributes() {
    return this.form.get('attributes') as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalogService: CatalogService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.route.params.pipe(
        // Только если есть categoryId
        filter(routeParams => routeParams.categoryId),
        // Только после получения categoryId получаем аттрибуты категории
        flatMap(routeParams => this.catalogService.getCategoryAttributes(routeParams.categoryId)),
        // Проставляем их в форме
        tap(attributes => {
          attributes.forEach(attribute => {
            this.attributes.push(new FormGroup({
              'label': new FormControl(attribute.name),
              'values': new FormArray(attribute.values.map(
                attributeValue => new FormGroup({
                  'id': new FormControl(attributeValue.id),
                  'value': new FormControl(attributeValue.value),
                  'checked': new FormControl(true)
                })))
            }));
          });
        }),
        // После того как проинициализировали форму, подписываемся на её изменения
        switchMap(() => this.form.valueChanges),
        // Пропускаем изменения которые чаще 500ms для разгрузки бэкенда
        debounceTime(500),
        filter(() => this.form.valid)
      ).subscribe(() => this.submit())
    );
  }

  public submit(): void {
    const attributes = this.form.value.attributes
      // Оставляем только те аттрибуты, у которых не все значения выделены чекбоксами
      .filter(attribute => attribute.values.length > attribute.values.filter((value) => value.checked).length)
      // Оставляем только массивы с id значений аттрибутов
      .map(attribute => attribute.values.filter((value) => value.checked).map(value => value.id))
      // Преобразуем в единый массив
      .reduce((prev, curr) => [...prev, ...curr], []);

    this.filter.emit({attributes});
  }

  public asFormArray(control: AbstractControl): FormArray {
    return control as FormArray;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
