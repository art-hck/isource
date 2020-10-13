export class RecommendedPositions {
  id: number;
  name: string;
  commodities: Commodity[];
  owner: Owner;
  createdAt: string;
  updatedAt: string;
}


export class Commodity {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  deliveryBasis: string;
  deliveryDate: string;
  isDeliveryDateAsap: boolean;
  createdAt: string;
  updatedAt: string;
}

export class Owner {
  id: number;
  email: string;
  roles: [string];
  name: string;
  givenName: string;
  familyName: string;
  uuid: string;
}
