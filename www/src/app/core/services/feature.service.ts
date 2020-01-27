import { Inject, Injectable } from '@angular/core';
import { GpnmarketConfigInterface } from "../config/gpnmarket-config.interface";
import { APP_CONFIG } from '@stdlib-ng/core';
import { Feature } from "../models/feature";
import { UserRole } from "../../user/models/user-role";

@Injectable()
export class FeatureService {

  constructor(@Inject(APP_CONFIG) private appConfig: GpnmarketConfigInterface) {}

  private get features(): {[key: string]: Feature} {
    return this.appConfig.features;
  }

  getFeature(featureName: string): Feature {
    if (this.features.hasOwnProperty(featureName)) {
      return this.features[featureName];
    } else {
      throw new Error(`Feature ${featureName} does not exist`);
    }
  }

  disabled(featureName: string): boolean {
    return this.getFeature(featureName).disabled;
  }

  allowed(featureName: string, roles: UserRole[]) {
    const featureRoles = this.getFeature(featureName).roles;
    const rolesMatch = this.getFeature(featureName).rolesMatch;

    return !featureRoles || featureRoles
      .filter(role => roles.indexOf(role) >= 0).length > (rolesMatch === 'full' ? featureRoles.length : 0);
  }

  available(featureName: string, roles?: UserRole[]) {
    return !this.disabled(featureName) && (!roles || this.allowed(featureName, roles));
  }
}
