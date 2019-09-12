import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'searchFilter'})
export class SearchFilterPipe implements PipeTransform {
  transform(value: any, input: string) {
    if (input) {
      input = input.toLowerCase();
      return value.filter(function (el: any) {
        return el.shortName.toLowerCase().indexOf(input) > -1 ||
          el.inn.indexOf(input) > -1;
      });
    }
    return value;
  }
}
