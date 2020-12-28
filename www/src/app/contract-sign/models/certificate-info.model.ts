import { CertificateModel } from "./certificate.model";

export interface CertificateInfoModel {
  data: CertificateModel;
  ownerInfo: any;
  issuerInfo: any;
  serialNumber: string;
}
