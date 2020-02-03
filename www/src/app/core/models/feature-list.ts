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
  users;
  contractGeneration;
  createProcedure;
  instructionsFileForCustomer;
  instructionsFileForBackoffice;
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
  users: {
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
};
