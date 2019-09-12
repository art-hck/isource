import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'searchFilter'})
export class SearchFilterPipe implements PipeTransform {
  transform(value: any, input: string) {
    if (input) {
      return value.filter(function (el: any) {
        return el.shortName.indexOf(input) > -1 ||
          el.inn.indexOf(input) > -1;
      })
    }
    return value;
  }
}
