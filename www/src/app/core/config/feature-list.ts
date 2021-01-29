import { UserRole } from "../../user/models/user-role";
import { Feature } from "../models/feature";

export interface IFeatureList {
  backofficeDashboard;
  customerDashboard;
  registration;
  customerRequest;
  createRequest;
  catalog;
  catalogUpdate;
  cart;
  approverRequest;
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
  backofficeAgreements;
  customerAgreements;
  recommendedPositions;
  recommendedQuantity;
  backofficeProfile;
  backofficeIntelplan;
  customerProfile;
  customerIntelplan;
  createTemplate;
  normalization;
  requestDashboard;
  contragents;
}

export const FeatureList: { [key in keyof IFeatureList]: Feature } = {
  backofficeDashboard: { roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE] },
  customerDashboard: { roles: [UserRole.CUSTOMER] },
  registration: {},
  customerRequest: { roles: [UserRole.CUSTOMER] },
  createRequest: { roles: [UserRole.CUSTOMER] },
  catalog: {roles: [UserRole.CUSTOMER, UserRole.BACKOFFICE]},
  catalogUpdate: { roles: [UserRole.ADMIN] },
  cart: { roles: [UserRole.CUSTOMER] },
  instructionsFileForCustomer: { roles: [UserRole.CUSTOMER] },
  approverRequest: { roles: [UserRole.CUSTOMER_APPROVER] },
  backofficeRequest: { roles: [UserRole.BACKOFFICE] },
  deliveryMonitor: { roles: [UserRole.BACKOFFICE] },
  createContragent: { roles: [UserRole.BACKOFFICE] },
  employees: { roles: [UserRole.SENIOR_BACKOFFICE] },
  contractGeneration: { roles: [UserRole.BACKOFFICE] },
  createProcedure: { roles: [UserRole.BACKOFFICE] },
  instructionsFileForBackoffice: { roles: [UserRole.BACKOFFICE] },
  editTechnicalProposal: { roles: [UserRole.BACKOFFICE] },
  publishRequest: { roles: [UserRole.CUSTOMER] },
  approveRequest: { roles: [UserRole.CUSTOMER, UserRole.CUSTOMER_APPROVER] },
  addRequestGroup: { roles: [UserRole.BACKOFFICE] },
  moveRequestGroup: { roles: [UserRole.BACKOFFICE] },
  kim: { roles: [UserRole.CUSTOMER] },
  sentToApprove: { roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE] },
  backofficeAgreements: { roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE] },
  customerAgreements: { roles: [UserRole.CUSTOMER] },
  recommendedPositions: { roles: [UserRole.CUSTOMER]},
  recommendedQuantity: { roles: [UserRole.CUSTOMER]},
  backofficeProfile: { roles: [UserRole.BACKOFFICE] },
  backofficeIntelplan: { roles: [UserRole.BACKOFFICE] },
  customerProfile: { roles: [UserRole.CUSTOMER] },
  customerIntelplan: { roles: [UserRole.CUSTOMER] },
  createTemplate: { roles: [UserRole.CUSTOMER] },
  normalization: { roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE]},
  requestDashboard: { roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE, UserRole.CUSTOMER]},
  contragents: {roles: [UserRole.CUSTOMER, UserRole.BACKOFFICE]}
};
