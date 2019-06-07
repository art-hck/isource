import { AttachedFile } from "./attached-file";

export interface PurchaseWinnerInfo {
  beneficiariesDocuments?: PurchaseBeneficiariesDocuments;
  id: string;
  place: number;
  creationDate: Date;
  supplierOfferId: string;
  supplier: PurchaseWinnerInfoSupplier;
}

export interface PurchaseWinnerInfoSupplier {
  contragentId: string;
  fullName: string;
  shortName: string;
  requisites: PurchaseWinnerInfoSupplierRequisites;
  contact: PurchaseWinnerInfoSupplierContact;
  addresses: PurchaseWinnerInfoSupplierAddresses;
}

interface PurchaseWinnerInfoSupplierRequisites {
  inn: string;
  kpp: string;
}

interface PurchaseWinnerInfoSupplierContact {
  fio: string;
  job: string;
  phone: string;
  email: string;
}

interface PurchaseWinnerInfoSupplierAddresses {
  factual: string;
  post: string;
}

interface PurchaseBeneficiariesDocuments {
  files: AttachedFile[];
  resolution: boolean|null;
}
