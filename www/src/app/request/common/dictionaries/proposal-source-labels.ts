import { ProcedureSource } from "../../back-office/enum/procedure-source";

export const ProposalSourceLabels: Record<ProcedureSource, string> = {
  [ProcedureSource.TECHNICAL_PROPOSAL]: 'ТП',
  [ProcedureSource.COMMERCIAL_PROPOSAL]: 'КП',
  [ProcedureSource.TECHNICAL_COMMERCIAL_PROPOSAL]: 'ТКП',
};
