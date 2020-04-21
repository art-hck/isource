import { OkeiCode } from "../../../shared/models/okei";
import { Okpd2Code } from "../../../shared/models/okpd2";
import { Uuid } from "../../../cart/models/uuid";

export class KimPriceOrderPosition {
  id: Uuid;
  name: string;
  okpd2: Okpd2Code;
  quantity: number;
  okei: OkeiCode;
  maxPrice?: number;
  comment?: string;
}
