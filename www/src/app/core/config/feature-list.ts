import { UserRole } from "../../user/models/user-role";
import { Feature } from "../models/feature";

export interface IFeatureList {
  dashboard;
  registration;
  customerRequest;
  createRequest;
  catalog;
  cart;
  backofficeRequest;
  deliveryMonitor;
  createContragent;
  employees;
  editTechnicalProposal;
  contractGeneration;
  createProcedure;
  instructionsFileForCustomer;
  instructionsFileForBackoffice;
  publishRequest;
  approveRequest;
  addRequestGroup;
  moveRequestGroup;
  kim;
  sentToApprove;
}

export const FeatureList: { [key in keyof IFeatureList]: Feature } = {
  dashboard: { roles: [UserRole.CUSTOMER] },
  registration: {},
  customerRequest: { roles: [UserRole.CUSTOMER] },
  createRequest: { roles: [UserRole.CUSTOMER] },
  catalog: {},
  cart: { roles: [UserRole.CUSTOMER] },
  instructionsFileForCustomer: { roles: [UserRole.CUSTOMER] },
  backofficeRequest: { roles: [UserRole.BACKOFFICE] },
  deliveryMonitor: { roles: [UserRole.BACKOFFICE] },
  createContragent: { roles: [UserRole.BACKOFFICE] },
  employees: { roles: [UserRole.SENIOR_BACKOFFICE] },
  contractGeneration: { roles: [UserRole.BACKOFFICE] },
  createProcedure: { roles: [UserRole.BACKOFFICE] },
  instructionsFileForBackoffice: { roles: [UserRole.BACKOFFICE] },
  editTechnicalProposal: { roles: [UserRole.BACKOFFICE] },
  publishRequest: { roles: [UserRole.CUSTOMER] },
  approveRequest: { roles: [UserRole.CUSTOMER] },
  addRequestGroup: { roles: [UserRole.BACKOFFICE] },
  moveRequestGroup: { roles: [UserRole.BACKOFFICE] },
  kim: { roles: [UserRole.CUSTOMER] },
  sentToApprove: { roles: [UserRole.SENIOR_BACKOFFICE] },
};
