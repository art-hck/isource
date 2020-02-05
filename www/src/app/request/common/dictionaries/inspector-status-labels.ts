import { InspectorStatus } from "../enum/inspector-status";

export const InspectorStatusLabels: { [key: string]: string } = {
  [InspectorStatus.CERTIFICATE_UPLOADED]: 'Загружен сертификат качества',
  [InspectorStatus.PACKAGES_LEFT_PRODUCTION_OPERATION_LINK]: 'Пакеты прошли через производственное звено',
  [InspectorStatus.OPTION_VERIFICATION]: 'Инспектор проверил характеристику'
};
