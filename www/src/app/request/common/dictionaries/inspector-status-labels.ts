import { InspectorStatus } from "../enum/inspector-status";

const labels: {[key: string]: string} = {};

labels[InspectorStatus.CERTIFICATE_UPLOADED] = 'Загружен сертификат качества';
labels[InspectorStatus.PACKAGES_LEFT_PRODUCTION_OPERATION_LINK] = 'Пакеты прошли через производственное звено';
labels[InspectorStatus.OPTION_VERIFICATION] = 'Инспектор проверил характеристику';

export const InspectorStatusLabels: {[key: string]: string} = labels;
