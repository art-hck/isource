import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomHttpClient } from "./custom-http-client.service";
import { MallConfigInterface } from '../config/mall-config.interface';
import { APP_CONFIG } from 'stdlib-ng/dist/core';

@Injectable({
  providedIn: 'root'
})
export class NsiHttpClient extends CustomHttpClient {

  constructor(
      http: HttpClient,
      @Inject(APP_CONFIG) appConfig: MallConfigInterface,
  ) {
    super(http, appConfig.endpoints.nsi);
  }

}
