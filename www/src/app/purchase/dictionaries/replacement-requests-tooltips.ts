import { ReplacementRequests } from "../enums/replacement-requests";

export const ReplacementRequestsTooltips: {[key: string]: string} = {};

ReplacementRequestsTooltips[ReplacementRequests.REQUEST_SENT] = 'Для позиции имеется запрос на замену';
ReplacementRequestsTooltips[ReplacementRequests.REQUEST_ACCEPTED] = 'Для позиции принят запрос на замену';
ReplacementRequestsTooltips[ReplacementRequests.REQUEST_CANCELED] = 'Для позиции отменён запрос на замену';
