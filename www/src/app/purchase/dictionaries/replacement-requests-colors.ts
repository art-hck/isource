import { ReplacementRequests } from "../enums/replacement-requests";

export const ReplacementRequestsColors: {[key: string]: string} = {};

ReplacementRequestsColors[ReplacementRequests.REQUEST_SENT] = '#535353';
ReplacementRequestsColors[ReplacementRequests.REQUEST_ACCEPTED] = '#008000';
ReplacementRequestsColors[ReplacementRequests.REQUEST_CANCELED] = '#ff0000';
