import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormDataService } from "../../../shared/services/form-data.service";

@Injectable()
export class KimPriceOrderService {
  constructor(private api: HttpClient, private formDataService: FormDataService) {}

  create(body) {
    const url = `kim/customer/add-price-order/manual`;
    console.log(body);
    return this.api.post(url, this.formDataService.toFormData(body));
  }
}

interface Body {
  name: string;
  deliveryAddress: string;
  deliveryConditions: string;
  quantity?: number;
  dateResponse?: string;
  dateDelivery?: string;
  isForSmallBusiness: boolean;
  isForProducer: boolean;
  isForAuthorizedDealer: boolean;
  isRussianProduction: boolean;
  isDenyMaxPricePosition: boolean;
  regions: string;
  positions: {
    name: string
    okpd2: string
    okei: string
    quantity: number
    maxPrice?: number
    comments?: string
  }[]
}
