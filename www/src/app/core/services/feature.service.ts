import { Inject, Injectable } from '@angular/core';
import { GpnmarketConfigInterface } from "../config/gpnmarket-config.interface";
import { APP_CONFIG } from '@stdlib-ng/core';
import { Feature } from "../models/feature";
import { UserRole } from "../../user/models/user-role";
import { FeatureList } from "../models/feature-list";

@Injectable()
export class FeatureService {

  constructor(@Inject(APP_CONFIG) private appConfig: GpnmarketConfigInterface) {}

  private get disabledFeatures(): string[] {
     return this.appConfig.disabledFeatures || [];
  }

  getFeature(featureName: string): Feature {
    if (FeatureList.hasOwnProperty(featureName)) {
      return FeatureList[featureName];
    } else {
      throw new Error(`Feature ${featureName} does not exist`);
    }
  }

  disabled(featureName: string): boolean {
    return this.getFeature(featureName).disabled || this.disabledFeatures.indexOf(featureName) >= 0;
  }

  allowed(featureName: string, roles: UserRole[]): boolean {
    const featureRoles = this.getFeature(featureName).roles;
    const rolesMatch = this.getFeature(featureName).rolesMatch;

    return !featureRoles || featureRoles
      .filter(role => roles.indexOf(role) >= 0).length > (rolesMatch === 'full' ? featureRoles.length : 0);
  }

  available(featureName: string, roles?: UserRole[]): boolean {
    return !this.disabled(featureName) && (!roles || this.allowed(featureName, roles));
  }
}
