import { UserRole } from "../../user/models/user-role";
import { Feature } from "../models/feature";

export interface IFeatureList {
  backofficeDashboard;
  customerDashboard;
  registration;
  customerRequest;
  createRequest;
  editRequestNameBackoffice;
  editRequestNameCustomer;
  catalog;
  catalogUpdate;
  cart;
  chat;
  notifications;
  approverRequest;
  backofficeRequest;
  deliveryMonitor;
  createContragent;
  editContragent;
  addContragentToUser;
  employees;
  editTechnicalProposal;
  contractGeneration;
  createProcedure;
  instructionsFileForCustomer;
  instructionsFileForBackoffice;
  publishRequest;
  approveRequest;
  addPosition;
  editPosition;
  backofficeCancelPosition;
  customerCancelPosition;
  changePositionStatus;
  addRequestGroup;
  moveRequestGroup;
  uploadPositionDocuments;
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
  hideRequestContragentsName;
}

export const FeatureList: { [key in keyof IFeatureList]: Feature } = {
  backofficeDashboard: { roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE] },
  customerDashboard: { roles: [UserRole.CUSTOMER] },
  registration: {},
  customerRequest: { roles: [UserRole.CUSTOMER] },
  createRequest: { roles: [UserRole.CUSTOMER] },
  editRequestNameBackoffice: { roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE_BUYER] },
  editRequestNameCustomer: { roles: [UserRole.CUSTOMER] },
  catalog: {roles: [UserRole.CUSTOMER, UserRole.BACKOFFICE, UserRole.ADMIN]},
  catalogUpdate: { roles: [UserRole.ADMIN] },
  cart: { roles: [UserRole.CUSTOMER] },
  chat: { roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE_BUYER, UserRole.CUSTOMER, UserRole.CUSTOMER_APPROVER] },
  notifications: { roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE_BUYER, UserRole.CUSTOMER, UserRole.CUSTOMER_APPROVER] },
  instructionsFileForCustomer: { roles: [UserRole.CUSTOMER] },
  approverRequest: { roles: [UserRole.CUSTOMER_APPROVER] },
  backofficeRequest: { roles: [UserRole.BACKOFFICE] },
  deliveryMonitor: { roles: [UserRole.BACKOFFICE] },
  createContragent: { roles: [UserRole.ADMIN, UserRole.BACKOFFICE_BUYER, UserRole.SENIOR_BACKOFFICE] },
  editContragent: { roles: [UserRole.ADMIN, UserRole.BACKOFFICE_BUYER, UserRole.SENIOR_BACKOFFICE] },
  addContragentToUser: { roles: [UserRole.ADMIN, UserRole.BACKOFFICE_BUYER, UserRole.SENIOR_BACKOFFICE] },
  employees: { roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE_OBSERVER] },
  contractGeneration: { roles: [UserRole.BACKOFFICE] },
  createProcedure: { roles: [UserRole.BACKOFFICE] },
  instructionsFileForBackoffice: { roles: [UserRole.BACKOFFICE_BUYER, UserRole.SENIOR_BACKOFFICE] },
  editTechnicalProposal: { roles: [UserRole.BACKOFFICE] },
  publishRequest: { roles: [UserRole.CUSTOMER] },
  approveRequest: { roles: [UserRole.CUSTOMER, UserRole.CUSTOMER_APPROVER] },
  addPosition: { roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE_BUYER, UserRole.CUSTOMER, UserRole.ADMIN] },
  editPosition: { roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE_BUYER, UserRole.ADMIN] },
  backofficeCancelPosition: { roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE_BUYER] },
  customerCancelPosition: { roles: [UserRole.CUSTOMER] },
  changePositionStatus: { roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE_BUYER, UserRole.ADMIN] },
  addRequestGroup: { roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE_BUYER] },
  moveRequestGroup: { roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE_BUYER] },
  uploadPositionDocuments: { roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE_BUYER, UserRole.CUSTOMER] },
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
  contragents: {roles: [UserRole.CUSTOMER, UserRole.BACKOFFICE, UserRole.ADMIN]},
  hideRequestContragentsName: {roles: [UserRole.SENIOR_BACKOFFICE, UserRole.BACKOFFICE_BUYER]}
};
