export class OkatoRegion {
  id?: number;
  code: OkatoRegionCode;
  name: string;
  parentCode?: OkatoRegionCode;
}

export type OkatoRegionCode = string;
