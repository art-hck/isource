import { UserRole } from "../../user/models/user-role";
import { Feature } from "./feature";

export interface IFeatureList {
  registration;
  customerRequest;
  createRequest;
  catalog;
  backofficeRequest;
  deliveryMonitor;
  createContragent;
  editTechnicalProposal;
  contractGeneration;
  createProcedure;
  instructionsFileForCustomer;
  instructionsFileForBackoffice;
  publishRequest;
}

export const FeatureList: { [key in keyof IFeatureList]: Feature } = {
  registration: {},
  customerRequest: {
    roles: [UserRole.CUSTOMER]
  },
  createRequest: {
    roles: [UserRole.CUSTOMER]
  },
  catalog: {
    roles: [UserRole.CUSTOMER]
  },
  instructionsFileForCustomer: {
    roles: [UserRole.CUSTOMER]
  },
  backofficeRequest: {
    roles: [UserRole.BACKOFFICE]
  },
  deliveryMonitor: {
    roles: [UserRole.BACKOFFICE]
  },
  createContragent: {
    roles: [UserRole.BACKOFFICE]
  },
  contractGeneration: {
    roles: [UserRole.BACKOFFICE]
  },
  createProcedure: {
    roles: [UserRole.BACKOFFICE]
  },
  instructionsFileForBackoffice: {
    roles: [UserRole.BACKOFFICE]
  },
  editTechnicalProposal: {
    roles: [UserRole.BACKOFFICE]
  },
  publishRequest: {
    roles: [UserRole.CUSTOMER]
  },
};
