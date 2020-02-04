import { TechnicalProposalsStatuses } from "../enum/technical-proposals-statuses";

const labels: {[key: string]: string} = {};

labels[TechnicalProposalsStatuses.NEW] = 'Черновик';
labels[TechnicalProposalsStatuses.SENT_TO_REVIEW] = 'На рассмотрении';
labels[TechnicalProposalsStatuses.ACCEPTED] = 'Согласовано';
labels[TechnicalProposalsStatuses.PARTIALLY_ACCEPTED] = 'Частично согласовано';
labels[TechnicalProposalsStatuses.CANCELED] = 'Отклонено';

export const TechnicalProposalsStatusesLabels: {[key: string]: string} = labels;
