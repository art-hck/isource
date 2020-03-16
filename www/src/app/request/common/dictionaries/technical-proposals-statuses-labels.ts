import { TechnicalProposalsStatus } from "../enum/technical-proposals-status";

export const TechnicalProposalsStatusesLabels: { [key in TechnicalProposalsStatus]: string } = {
  [TechnicalProposalsStatus.NEW]: 'Черновик',
  [TechnicalProposalsStatus.SENT_TO_REVIEW]: 'На рассмотрении',
  [TechnicalProposalsStatus.ACCEPTED]: 'Согласовано',
  [TechnicalProposalsStatus.PARTIALLY_ACCEPTED]: 'Частично согласовано',
  [TechnicalProposalsStatus.CANCELED]: 'Отклонено',
  [TechnicalProposalsStatus.DECLINED]: 'Отклонено'
};
