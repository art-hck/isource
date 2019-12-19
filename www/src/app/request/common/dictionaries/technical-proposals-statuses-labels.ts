import { TechnicalProposalsStatuses } from "../enum/technical-proposals-statuses";

const labels: {[key: string]: string} = {};

labels[TechnicalProposalsStatuses.NEW] = 'Подготовка предложения';
labels[TechnicalProposalsStatuses.SENT_TO_REVIEW] = 'На согласовании заказчика';
labels[TechnicalProposalsStatuses.ACCEPTED] = 'Согласовано';

export const TechnicalProposalsStatusesLabels: {[key: string]: string} = labels;
