import { UserRole } from "../../user/models/user-role";
import { Feature } from "./feature";

export const FeatureList: { [key: string]: Feature } = {
  customerRequest: {
    roles: [UserRole.CUSTOMER]
  },
  createRequest: {
    roles: [UserRole.CUSTOMER]
  },
  catalog: {
    roles: [UserRole.CUSTOMER]
  },
  backofficeRequest: {
    roles: [UserRole.BACKOFFICE]
  },
  deliveryMonitor: {
    roles: [UserRole.BACKOFFICE]
  }
};
