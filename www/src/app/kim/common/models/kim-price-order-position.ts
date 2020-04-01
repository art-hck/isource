import { OkeiCode } from "../../../shared/models/okei";
import { Okpd2Code } from "../../../shared/models/okpd2";

export class KimPriceOrderPosition {
  name: string;
  okpd2: Okpd2Code;
  quantity: number;
  okei: OkeiCode;
  maxPrice: number;
  comment: string;
}
