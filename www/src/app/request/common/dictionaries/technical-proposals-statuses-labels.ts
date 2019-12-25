import { TechnicalProposalsStatuses } from "../enum/technical-proposals-statuses";

const labels: {[key: string]: string} = {};

labels[TechnicalProposalsStatuses.NEW] = 'Черновик';
labels[TechnicalProposalsStatuses.SENT_TO_REVIEW] = 'Решение не принято';
labels[TechnicalProposalsStatuses.ACCEPTED] = 'Согласовано';

export const TechnicalProposalsStatusesLabels: {[key: string]: string} = labels;
