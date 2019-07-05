import {RequestTypes} from "../enum/request-types";

export const RequestTypesLabels: {[key: string]: string} = {};

RequestTypesLabels[RequestTypes.MANUAL] = 'manual';
RequestTypesLabels[RequestTypes.FILE_IMPORT] = 'file-import';
RequestTypesLabels[RequestTypes.FREE_FORM] = 'free-form';
