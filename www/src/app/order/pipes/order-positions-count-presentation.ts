import {Pipe, PipeTransform} from "@angular/core";
import {getPositionsCountRepresentation} from "../utils/format";

@Pipe({name: 'orderPositionsCountPresentation'})
export class OrderPositionsCountPresentation implements PipeTransform {
  transform(value: number): any {
    return getPositionsCountRepresentation(value);
  }
}
