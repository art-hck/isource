import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories-filters',
  templateUrl: './categories-filters.component.html',
  styleUrls: ['./categories-filters.component.css']
})
export class CategoriesFiltersComponent implements OnInit {

  // todo Пока что выводим статичные данные. Потом нужно заменить на серверные
  categories: Array<any> = [
    {
      id: '',
      name: 'Руда железная товарная необогащенная',
      countPosition: 21
    },
    {
      id: '',
      name: 'Концентрат желозорудный',
      countPosition: 7
    },
    {
      id: '',
      name: 'Агломерат желозорудный',
      countPosition: 2
    },
    {
      id: '',
      name: 'Окатыши желозорудные(окисленные)',
      countPosition: 3
    },
    {
      id: '',
      name: 'Железофлюс',
      countPosition: 43
    },
    {
      id: '',
      name: 'Окатыши металлизованные',
      countPosition: 2
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
