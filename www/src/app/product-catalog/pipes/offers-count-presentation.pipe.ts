import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'offersCountPresentation'})
export class OffersCountPresentation implements PipeTransform {
  transform(offersCount: number): any {
    if (offersCount >= 10 && offersCount <= 19) {
      return offersCount + ' предложений';
    }

    const rem = offersCount % 10;

    if (rem === 1) {
      return offersCount + ' предложение';
    }

    if (rem >= 2 && rem <= 4) {
      return offersCount + ' предложения';
    }

    return offersCount + ' предложений';
  }
}
