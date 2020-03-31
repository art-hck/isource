import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class KimPriceOrderService {
  constructor(private api: HttpClient) {}
}
