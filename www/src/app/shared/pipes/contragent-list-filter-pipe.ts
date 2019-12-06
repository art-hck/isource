import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'contragentSearchFilter'})

export class ContragentSearchFilterPipe implements PipeTransform {
  transform(value: any, input: string) {
    if (input) {
      input = input.toLowerCase().trim();
      return value.filter(function (el: any) {
        return (el.fullName.toLowerCase().indexOf(input) > -1) ||
               (el.shortName.toLowerCase().indexOf(input) > -1) ||
               (el.inn.toLowerCase().indexOf(input) > -1);
      });
    }
    return value;
  }
}
