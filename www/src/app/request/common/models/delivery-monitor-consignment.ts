export class DeliveryMonitorConsignment {
  consignmentId: string;
  contractAnnexId: string;
  planeShipmentDate: null;
  deliveryNoteNumber: null;
  deliveryState: string;
  factualShipmentDate: null;
  cargos: [
    {
        cargoId: string,
        eiCargoAmount: string,
        amountEi: number,
        numberPositionSf: string,
        isLong: null,
        isPonderous: null,
        weightByTd: number,
        eiWeightByProvider: null,
        amountSeatsByTd: number,
        cargoNameByTd: null,
        weightFromProvider: number
      }
  ];
  consignor: {
    companyId: string,
    sapCode: null,
    name: string,
    companyType: string,
    actualAddressId: null,
    requisites: null,
    actualAddress: {
      rawAddress: string
    }
  };
  waybills: [
    {
      waybillNumber: string,
      rawWaybillNumber: null,
      actualDocumentLocation: null,
      loadingDate: null,
      amountSeats: number,
      cargoWeight: number,
      expectedDateOfArrival: null,
      estimatedDateOfArrival: null,
      actualArrivalDate: null,
      departureDate: null,
      consignmentId: null,
      deliveryState: string,
      weightByTd: number,
      waybillId: string,
      vehicles: [
        {
          vehicleNumber: string,
          shipmentDate: Date,
          vehicleType: string,
          vehicleId: string
        }
      ]
    }
  ];
  invoice: {
    internalNumber: string,
    externalNumber: string,
    issuedAt: Date,
    invoiceId: string
  };
}
