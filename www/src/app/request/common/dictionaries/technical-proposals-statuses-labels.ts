import { TechnicalProposalsStatuses } from "../enum/technical-proposals-statuses";

export const TechnicalProposalsStatusesLabels: { [key: string]: string } = {
  [TechnicalProposalsStatuses.NEW]: 'Черновик',
  [TechnicalProposalsStatuses.SENT_TO_REVIEW]: 'На рассмотрении',
  [TechnicalProposalsStatuses.ACCEPTED]: 'Согласовано',
  [TechnicalProposalsStatuses.PARTIALLY_ACCEPTED]: 'Частично согласовано',
  [TechnicalProposalsStatuses.CANCELED]: 'Отклонено'
};
