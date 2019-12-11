export class InspectorInfo {
  mtrEventId: string;
  goodId: string;
  occurredAt: string;
  type: string;
  payload: InspectorPayload;
}

export class InspectorPayload {
  certificateId?: string;
  productionOperationLinkId?: string;
}
